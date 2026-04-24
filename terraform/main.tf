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

# Fix Lỗi 1 & 2: Cấu hình Subnet, Network Plugin và Version
resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.aks_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "chillphimaks"
  
  # Fix Lỗi 2: Dùng biến cho Kubernetes version
  kubernetes_version  = var.kubernetes_version
  sku_tier            = "Free"

  default_node_pool {
    name            = "default"
    node_count      = 1
    vm_size         = var.node_size
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
    docker_bridge_cidr = "172.17.0.1/16"  # Dải IP cho Docker Bridge
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