variable "resource_group_name" {
  type    = string
  default = "chillphim-rg"
}

variable "location" {
  type    = string
  default = "japaneast" 
}

# Fix Lỗi 3: Tên ACR chuẩn hóa
variable "acr_name" {
  type    = string
  default = "chillphimacr2026phat" # Thêm định danh để tránh trùng global
}

variable "aks_name" {
  type    = string
  default = "chillphim-aks"
}

variable "kubernetes_version" {
  type    = string
  default = "1.32.11"
}

variable "node_size" {
  type    = string
  default = "Standard_B2s"
}