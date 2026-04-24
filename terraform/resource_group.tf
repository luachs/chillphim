resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Project = "chillphim"
    Owner   = "Phat"
  }
}