# 🎬 ChillPhim – Movie Streaming System (Cloud Native Edition)

**ChillPhim** là hệ thống quản lý phim trực tuyến được thiết kế theo tư duy Cloud-Native, tích hợp chặt chẽ quy trình DevOps hiện đại từ triển khai hạ tầng đến giám sát hiệu năng thực tế.

**🌐 Live Demo:** [https://chillphim2026.duckdns.org](https://chillphim2026.duckdns.org)
![System Architecture](./src/public/demo.png)

---

## 🏗️ Architecture & Cloud Infrastructure

Hệ thống được vận hành trên Azure với sự hỗ trợ của mô hình **Infrastructure as Code (IaC)**.

![System Architecture](./src/public/architecture_system.jpg)

✨ **Key Features:**

- **☁️ Zero-Touch Infrastructure:** Toàn bộ tài nguyên (Resource Group, AKS, ACR) được khởi tạo tự động qua **Terraform**, loại bỏ cấu hình thủ công.
- **🛡️ Hardened Security:** Sử dụng **Azure Application Gateway (WAF)** bảo vệ lớp biên và **Azure Key Vault** kết hợp **Secrets Store CSI Driver** để quản lý thông tin nhạy cảm.
- **🚢 Unified Orchestration:** Vận hành trên **Azure Kubernetes Service (AKS)**, đảm bảo tính sẵn sàng cao và khả năng tự hồi phục (Self-Healing).
- **🤖 Automated CI/CD:** Pipeline **GitHub Actions** tự động đóng gói Docker Image, đẩy vào ACR và cập nhật tức thì lên Cluster.
- **🕸️ Edge Security:** Tích hợp **Cert-manager** tự động cấp phát và quản lý chứng chỉ SSL/TLS từ Let's Encrypt.
- **📊 K8s-Native Monitoring:** Triển khai Full Stack **Prometheus & Grafana** để quan sát sức khỏe Cluster theo thời gian thực.

---

# 📈 Performance & Monitoring

Hệ thống được kiểm thử áp lực (Stress Test) bằng công cụ **k6** để xác định ngưỡng chịu tải của hạ tầng Azure Student (Node B2s). Quá trình kiểm thử được thực hiện qua hai giai đoạn tăng trưởng lưu lượng nhằm đánh giá khả năng co giãn và độ ổn định thực tế của Cluster.

### ✨ Observability Insights

* **🧪 Multi-Stage Load Testing (k6):**
    * **Giai đoạn 1 (50 Users):** Hệ thống vận hành ở trạng thái lý tưởng. Chỉ số CPU Usage duy trì ổn định dưới mức `Requests` (0.2), không xảy ra hiện tượng trễ phản hồi hay lỗi request.
    * **Giai đoạn 2 (100 Users):** Mô phỏng lưu lượng truy cập cao điểm. Hệ thống xử lý thành công **1,132 requests** với tỉ lệ **99.87% OK**. Biểu đồ giám sát ghi nhận CPU nhảy vọt vượt ngưỡng `Requests` nhưng vẫn nằm trong giới hạn an toàn của `Limits` (0.5).
* **📉 Smart Resource Quota:** Thông qua việc thiết lập nghiêm ngặt cơ chế Resource Quota (`Requests` & `Limits`), hệ thống đảm bảo tính cô lập tài nguyên. Dù tải tăng gấp đôi, các dịch vụ nền vẫn không bị ảnh hưởng, ngăn chặn hoàn toàn hiện tượng sập cụm AKS do quá tải cục bộ.
* **🚀 Efficient Recovery:** Ngay sau khi kết thúc đợt tải đỉnh điểm (sau mốc 19:20), cơ chế điều phối của Kubernetes kết hợp với giám sát từ Grafana cho thấy tài nguyên CPU/RAM được giải phóng ngay lập tức, đưa hệ thống về trạng thái ổn định chỉ trong vài giây.

---

### 📊 Monitoring Visuals

![Cluster Monitoring](./src/public/monitoring1.png)
*Giám sát tổng thể tài nguyên Cluster tại thời điểm thực hiện Stress Test.*

![Pod Performance](./src/public/monitoring2.png)
*Biểu đồ chi tiết hiệu năng Pod ứng dụng với hai "ngọn núi" tài nguyên tương ứng với hai đợt test 50 và 100 users.*

## 👨‍💻 Author

**Nguyễn Thành Phát**
_Dự án tập trung vào: Fullstack Development | Cloud Engineering | DevOps ._
