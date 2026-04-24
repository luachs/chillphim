terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Fix Lỗi 5 & NÊN thêm: Thêm tags cho Resource Group
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Project = "chillphim"
    Owner   = "Phat"
  }
}

resource "azurerm_virtual_network" "vnet" {
  name                = "chillphim-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "chillphim-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

# Fix Lỗi 3: ACR Name (Đã đổi trong variables.tf)
resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
}

# Fix Lỗi 4: Thêm Log Analytics Workspace để debug
resource "azurerm_log_analytics_workspace" "log" {
  name                = "chillphim-log"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_subnet" "gw_subnet" {
  name                 = "gateway-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.2.0/24"] # Dải IP mới không trùng với 10.0.1.0 của AKS
}


# Fix Lỗi 1 & 2: Cấu hình Subnet, Network Plugin và Version
resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.aks_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "chillphimaks"
  oidc_issuer_enabled       = true
  workload_identity_enabled = true # Khuyên dùng kèm để demo chuyên nghiệp hơn
  
  ingress_application_gateway {
    gateway_name = "chillphim-appgw"
    subnet_id    = azurerm_subnet.gw_subnet.id
  }

  # Fix Lỗi 2: Dùng biến cho Kubernetes version
  kubernetes_version  = var.kubernetes_version
  sku_tier            = "Free"

  default_node_pool {
    name            = "default"
    node_count      = 1
    vm_size         = "Standard_D2s_v3"
    # Fix Lỗi 1: Gắn vào Subnet của VNet
    vnet_subnet_id  = azurerm_subnet.subnet.id
  }

  identity {
    type = "SystemAssigned"
  }

  # Fix Lỗi 1: Dùng network_plugin azure (Azure CNI)
  network_profile {
    network_plugin = "azure"
    network_policy = "azure" # Khuyên dùng thêm để bảo mật subnet

    # --- THÊM CÁC DÒNG DƯỚI ĐÂY ---
    service_cidr       = "10.1.0.0/16"    # Dải IP cho Service (Khác với 10.0.x.x của VNET)
    dns_service_ip     = "10.1.0.10"      # IP của dịch vụ DNS (Phải nằm trong service_cidr)
  }

  # Fix Lỗi 4: Monitor log
  oms_agent {
    log_analytics_workspace_id = azurerm_log_analytics_workspace.log.id
  }

  tags = {
    Environment = "Development"
    Project     = "chillphim"
  }
}

resource "azurerm_role_assignment" "aks_to_acr" {
  principal_id                     = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.acr.id
  skip_service_principal_aad_check = true
}


resource "azurerm_public_ip" "gw_pip" {
  name                = "chillphim-gw-ip"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  allocation_method   = "Static"
  sku                 = "Standard" # AGW v2 bắt buộc dùng Standard IP
}


# 1. Tạo Network Security Group (NSG) cho AKS Subnet
resource "azurerm_network_security_group" "aks_nsg" {
  name                = "chillphim-aks-nsg"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  # Rule 100: Cho phép traffic từ Gateway Subnet (10.0.2.0/24) vào AKS Subnet
  # Giúp App Gateway có thể forward request đến Pod
  security_rule {
    name                       = "AllowAGWToAKS"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "3000" # Port ứng dụng chillphim của bạn
    source_address_prefix      = "10.0.2.0/24" 
    destination_address_prefix = "10.0.1.0/24"
  }

  # Rule 110: Cho phép Azure Load Balancer Health Probe
  # CỰC KỲ QUAN TRỌNG: Nếu thiếu, Azure sẽ coi Node là "unhealthy" và ngắt kết nối
  security_rule {
    name                       = "AllowAzureLoadBalancerInbound"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "AzureLoadBalancer"
    destination_address_prefix = "*"
  }

  # Rule 120: Cho phép giao tiếp nội bộ trong Subnet (Intra-subnet traffic)
  # Đảm bảo các Node và Pod có thể nói chuyện với nhau qua Azure CNI
  security_rule {
    name                       = "AllowInternalSubnetInbound"
    priority                   = 120
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "10.0.1.0/24"
    destination_address_prefix = "10.0.1.0/24"
  }

  # Rule 1000: Chặn sạch sành sanh từ Internet vào thẳng AKS Nodes
  # Hoàn tất mô hình Zero Trust
  security_rule {
    name                       = "DenyInternetInbound"
    priority                   = 1000
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "Internet"
    destination_address_prefix = "*"
  }

  tags = {
    Project = "chillphim"
    Security = "ZeroTrust"
  }
}

resource "azurerm_subnet_network_security_group_association" "aks_nsg_assoc" {
  subnet_id                 = azurerm_subnet.subnet.id
  network_security_group_id = azurerm_network_security_group.aks_nsg.id
}

