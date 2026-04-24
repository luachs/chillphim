variable "resource_group_name" {
  type    = string
  default = "chillphim-rg"
}

variable "location" {
  type    = string
  default = "japaneast"
}

variable "acr_name" {
  type    = string
  default = "chillphimacr2026phat"
}

variable "aks_name" {
  type    = string
  default = "chillphim-aks"
}

variable "kubernetes_version" {
  type    = string
  default = "1.34.4"
}

variable "node_size" {
  type    = string
  default = "Standard_D2s_v3"
}