<template>
  <div class="recruitment-list">
    <h1 class="page-title">Danh Sách Đơn Tuyển Dụng</h1>

    <div class="filters">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm theo tên hoặc email..."
          @input="filterApplications"
          class="search-input"
        />
      </div>

      <div class="status-filter">
        <select
          v-model="statusFilter"
          @change="filterApplications"
          class="filter-select"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="OK">Chờ duyệt</option>
          <option value="CF">Đã duyệt</option>
          <option value="RJ">Đã từ chối</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else-if="filteredApplications.length === 0" class="no-data">
      <p>Không có đơn tuyển dụng nào</p>
    </div>

    <div v-else class="data-grid">
      <table class="applications-table">
        <thead>
          <tr>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Vị trí</th>
            <th>CV</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="application in filteredApplications"
            :key="application.id"
            :class="{
              approved: application.status === 'CF',
              rejected: application.status === 'RJ',
            }"
            @click="viewApplication(application)"
          >
            <td>{{ application.hoTen }}</td>
            <td>{{ application.email }}</td>
            <td>{{ application.soDienThoai }}</td>
            <td>{{ application.viTri }}</td>
            <td>
              <button
                @click.stop="viewCV(application.fileCV)"
                class="view-cv-btn"
              >
                Xem CV
              </button>
            </td>
            <td>
              <span :class="getStatusClass(application.status)">
                {{ getStatusText(application.status) }}
              </span>
            </td>
            <td class="actions" @click.stop>
              <button
                v-if="application.status !== 'CF'"
                @click="approveApplication(application)"
                class="approve-btn"
                :disabled="application.status === 'RJ'"
              >
                Duyệt
              </button>
              <button
                v-if="application.status !== 'RJ'"
                @click="rejectApplication(application)"
                class="reject-btn"
                :disabled="application.status === 'CF'"
              >
                Từ chối
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal xem chi tiết đơn tuyển dụng -->
    <div v-if="selectedApplication" class="modal">
      <div class="modal-content">
        <span class="close-modal" @click="closeModal">&times;</span>
        <h2>Chi Tiết Đơn Ứng Tuyển</h2>

        <div class="detail-content">
          <div class="detail-row">
            <div class="detail-label">Họ và tên:</div>
            <div class="detail-value">{{ selectedApplication.hoTen }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Email:</div>
            <div class="detail-value">{{ selectedApplication.email }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Số điện thoại:</div>
            <div class="detail-value">
              {{ selectedApplication.soDienThoai }}
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Vị trí ứng tuyển:</div>
            <div class="detail-value">{{ selectedApplication.viTri }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Nội dung:</div>
            <div class="detail-value detail-content-value">
              {{ selectedApplication.noiDung }}
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-label">CV:</div>
            <div class="detail-value">
              <button
                @click="viewCV(selectedApplication.fileCV)"
                class="view-cv-btn"
              >
                Xem CV
              </button>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Trạng thái:</div>
            <div class="detail-value">
              <span :class="getStatusClass(selectedApplication.status)">
                {{ getStatusText(selectedApplication.status) }}
              </span>
            </div>
          </div>

          <div class="detail-actions">
            <button
              v-if="selectedApplication.status !== 'CF'"
              @click="approveApplication(selectedApplication)"
              class="approve-btn"
              :disabled="selectedApplication.status === 'RJ'"
            >
              Duyệt đơn
            </button>
            <button
              v-if="selectedApplication.status !== 'RJ'"
              @click="rejectApplication(selectedApplication)"
              class="reject-btn"
              :disabled="selectedApplication.status === 'CF'"
            >
              Từ chối đơn
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xem CV -->
    <div v-if="showCVModal" class="modal cv-modal">
      <div class="modal-content cv-modal-content">
        <span class="close-modal" @click="closeCVModal">&times;</span>
        <h2>Xem CV</h2>

        <div class="cv-container">
          <iframe
            :src="currentCV"
            width="100%"
            height="600px"
            @load="handleCVLoad"
            @error="handleCVError"
            ref="cvIframe"
          ></iframe>
          <div v-if="cvLoadError" class="cv-error">
            <div class="cv-error-icon">!</div>
            <p>Không thể tải CV. File có thể bị lỗi hoặc không tồn tại.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";
export default {
  name: "DanhSachTuyenDung",

  data() {
    return {
      applications: [],
      filteredApplications: [],
      selectedApplication: null,
      searchQuery: "",
      statusFilter: "ALL",
      loading: true,
      showCVModal: false,
      currentCV: "",
      cvLoadError: false,
      processingIds: new Set(), // Để tránh nhấn nút nhiều lần
    };
  },

  created() {
    this.fetchApplications();
  },
  mounted(){
    document.title="VMD - ADMIN";
  },
  methods: {
    async fetchApplications() {
      this.loading = true;
      try {
        const response = await axios.get("api/tuyendung");
        if (Array.isArray(response.data)) {
          this.applications = response.data;
        } else if (response.data && typeof response.data === "object") {
          // Nếu API trả về một object thay vì array
          this.applications = [response.data];
        } else {
          this.applications = [];
        }
        this.filterApplications();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn tuyển dụng:", error);
        this.applications = [];
      } finally {
        this.loading = false;
      }
    },

    filterApplications() {
      let filtered = [...this.applications];

      // Lọc theo từ khóa tìm kiếm
      if (this.searchQuery.trim() !== "") {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (app) =>
            app.hoTen.toLowerCase().includes(query) ||
            app.email.toLowerCase().includes(query) ||
            app.soDienThoai.includes(query) ||
            app.viTri.toLowerCase().includes(query)
        );
      }

      // Lọc theo trạng thái
      if (this.statusFilter !== "ALL") {
        filtered = filtered.filter((app) => app.status === this.statusFilter);
      }

      this.filteredApplications = filtered;
    },

    getStatusText(status) {
      switch (status) {
        case "OK":
          return "Chờ duyệt";
        case "CF":
          return "Đã duyệt";
        case "RJ":
          return "Đã từ chối";
        default:
          return "Không xác định";
      }
    },

    getStatusClass(status) {
      switch (status) {
        case "OK":
          return "status-pending";
        case "CF":
          return "status-approved";
        case "RJ":
          return "status-rejected";
        default:
          return "";
      }
    },

    viewApplication(application) {
      this.selectedApplication = { ...application };
    },

    viewCV(cvPath) {
      // Ngăn việc mở modal lồng trong modal
      event.stopPropagation();

      this.currentCV = getFullFtpUrl(cvPath);
      this.cvLoadError = false; // Reset trạng thái lỗi
      this.showCVModal = true;
    },

    closeModal() {
      this.selectedApplication = null;
    },

    closeCVModal() {
      this.showCVModal = false;
      this.currentCV = "";
      this.cvLoadError = false;
    },

    handleCVLoad(event) {
      // Kiểm tra nếu iframe đã load nhưng nội dung không có hoặc lỗi
      const iframe = this.$refs.cvIframe;
      try {
        // Cố gắng truy cập nội dung iframe để kiểm tra
        // Đối với một số lỗi, việc truy cập nội dung có thể gây ra exception
        if (iframe.contentDocument && iframe.contentDocument.body) {
          // Nếu nội dung là trang lỗi hoặc rỗng
          if (
            iframe.contentDocument.body.innerHTML.includes("error") ||
            iframe.contentDocument.body.innerHTML.includes("404") ||
            iframe.contentDocument.body.innerHTML.trim() === ""
          ) {
            this.cvLoadError = true;
          }
        }
      } catch (e) {
        // Nếu không thể truy cập nội dung iframe (cross-origin),
        // không xác định được lỗi rõ ràng
        // Trong trường hợp này, chúng ta giả định CV đã load thành công
      }
    },

    handleCVError() {
      this.cvLoadError = true;
    },

    async approveApplication(application) {
      if (this.processingIds.has(application.id)) {
        return; // Nếu đơn này đang được xử lý, không làm gì cả
      }

      if (
        confirm(
          `Bạn có chắc muốn duyệt đơn ứng tuyển của ${application.hoTen}?`
        )
      ) {
        this.processingIds.add(application.id);

        try {
          // Clone đối tượng hiện tại và cập nhật trạng thái
          const updatedData = { ...application, status: "CF" };

          // Gửi yêu cầu cập nhật
          await axios.post(
            `api/tuyendung/update/${application.id}`,
            updatedData
          );

          // Cập nhật trạng thái trong danh sách
          const index = this.applications.findIndex(
            (app) => app.id === application.id
          );
          if (index !== -1) {
            this.applications[index].status = "CF";

            // Cập nhật ngày duyệt và người duyệt nếu API trả về
            if (
              this.selectedApplication &&
              this.selectedApplication.id === application.id
            ) {
              this.selectedApplication.status = "CF";
            }
          }

          // Cập nhật lại danh sách lọc
          this.filterApplications();

          alert("Đơn ứng tuyển đã được duyệt thành công!");
        } catch (error) {
          console.error("Lỗi khi duyệt đơn:", error);
          alert("Đã xảy ra lỗi khi duyệt đơn. Vui lòng thử lại sau.");
        } finally {
          this.processingIds.delete(application.id);
        }
      }
    },

    async rejectApplication(application) {
      if (this.processingIds.has(application.id)) {
        return; // Nếu đơn này đang được xử lý, không làm gì cả
      }

      if (
        confirm(
          `Bạn có chắc muốn từ chối đơn ứng tuyển của ${application.hoTen}?`
        )
      ) {
        this.processingIds.add(application.id);

        try {
          // Clone đối tượng hiện tại và cập nhật trạng thái
          const updatedData = { ...application, status: "RJ" };

          // Gửi yêu cầu cập nhật
          await axios.post(
            `api/tuyendung/update/${application.id}`,
            updatedData
          );
          console.log(updatedData);
          // Cập nhật trạng thái trong danh sách
          const index = this.applications.findIndex(
            (app) => app.id === application.id
          );
          if (index !== -1) {
            this.applications[index].status = "RJ";

            // Cập nhật trạng thái trong modal chi tiết nếu đang mở
            if (
              this.selectedApplication &&
              this.selectedApplication.id === application.id
            ) {
              this.selectedApplication.status = "RJ";
            }
          }

          // Cập nhật lại danh sách lọc
          this.filterApplications();

          alert("Đơn ứng tuyển đã được từ chối thành công!");
        } catch (error) {
          console.error("Lỗi khi từ chối đơn:", error);
          alert("Đã xảy ra lỗi khi từ chối đơn. Vui lòng thử lại sau.");
        } finally {
          this.processingIds.delete(application.id);
        }
      }
    },
  },
};

</script>

<style scoped>
.recruitment-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-box {
  flex-grow: 1;
  margin-right: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.filter-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 150px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-data {
  text-align: center;
  padding: 50px 0;
  color: #7f8c8d;
  font-size: 18px;
}

.applications-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.applications-table th,
.applications-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.applications-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #333;
}

.applications-table tr:hover {
  background-color: #f9f9f9;
  cursor: pointer;
}

.applications-table tr.approved {
  background-color: #d4edda;
}

.applications-table tr.approved:hover {
  background-color: #c3e6cb;
}

.applications-table tr.rejected {
  background-color: #f8d7da;
}

.applications-table tr.rejected:hover {
  background-color: #f5c6cb;
}

.status-pending {
  color: #856404;
  background-color: #fff3cd;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-approved {
  color: #155724;
  background-color: #d4edda;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-rejected {
  color: #721c24;
  background-color: #f8d7da;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.actions {
  white-space: nowrap;
}

.approve-btn,
.reject-btn,
.view-cv-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  margin-right: 5px;
  transition: background-color 0.3s;
}

.approve-btn {
  background-color: #28a745;
  color: white;
}

.approve-btn:hover {
  background-color: #218838;
}

.reject-btn {
  background-color: #dc3545;
  color: white;
}

.reject-btn:hover {
  background-color: #c82333;
}

.view-cv-btn {
  background-color: #17a2b8;
  color: white;
}

.view-cv-btn:hover {
  background-color: #138496;
}

.approve-btn:disabled,
.reject-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  width: 80%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.cv-modal-content {
  width: 90%;
  max-width: 900px;
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 28px;
  font-weight: bold;
  color: #aaa;
  cursor: pointer;
}

.close-modal:hover {
  color: #333;
}

.detail-content {
  margin-top: 20px;
}

.detail-row {
  display: flex;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.detail-label {
  width: 30%;
  font-weight: bold;
  color: #333;
}

.detail-value {
  width: 70%;
}

.detail-content-value {
  white-space: pre-line;
}

.detail-actions {
  margin-top: 25px;
  display: flex;
  justify-content: flex-end;
}

.detail-actions button {
  margin-left: 10px;
  padding: 8px 16px;
}

.cv-container {
  margin-top: 20px;
  border: 1px solid #ddd;
  min-height: 600px;
  position: relative;
}

.cv-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 5;
  text-align: center;
  padding: 20px;
}

.cv-error-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #dc3545;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 20px;
}

.cv-error p {
  font-size: 18px;
  color: #495057;
  max-width: 80%;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .search-box {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .applications-table {
    display: block;
    overflow-x: auto;
  }

  .detail-row {
    flex-direction: column;
  }

  .detail-label,
  .detail-value {
    width: 100%;
  }

  .detail-label {
    margin-bottom: 5px;
  }
}
</style>