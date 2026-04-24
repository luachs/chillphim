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
  default = "Standard_B2s"
}

# --- Biến nhạy cảm (Lấy từ terraform.tfvars) ---
variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "mongodb_uri" {
  type      = string
  sensitive = true
}

# --- Biến Cloudinary (Xử lý lỗi Undeclared) ---
variable "cloudinary_cloud_name" {
  type    = string
  default = ""
}

variable "cloudinary_api_key" {
  type    = string
  default = ""
}

variable "cloudinary_api_secret" {
  type      = string
  default   = ""
  sensitive = true
}