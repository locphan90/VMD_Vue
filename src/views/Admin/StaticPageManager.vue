<template>
  <div class="container">
    <h1 class="page-title">Quản lý nội dung</h1>

    <div class="content-wrapper">
      <!-- Combobox -->
      <div class="control-box">
        <label class="control-label">Danh mục</label>
        <div class="select-wrapper">
          <select
            v-model="selectedCategory"
            @change="fetchContent"
            class="select-control"
          >
            <option value="VECHUNGTOI">VỀ CHÚNG TÔI</option>
            <option value="LIENHE">LIÊN HỆ</option>
            <option value="HETHONGDAILY">KHO - ĐẠI LÝ</option>
            <option value="CHINHSACHDAILY">CHÍNH SÁCH ĐẠI LÝ</option>
            <option value="CHINHSACHBAOMAT">CHÍNH SÁCH BẢO MẬT</option>
            <option value="CHINHSACHGIAONHANHANG">
              CHÍNH SÁCH GIAO NHẬN HÀNG
            </option>
            <option value="HOIDAPDAILY">HỎI ĐÁP ĐẠI LÝ</option>
            <option value="CHINHSACHDOITRA">CHÍNH SÁCH ĐỔI TRẢ</option>
            <option value="TRUNGTAMHOTRO">TRUNG TÂM HỖ TRỢ</option>
            <option value="HUONGDANMUAHANG">HƯỚNG DẪN MUA HÀNG</option>
            <option value="DIEUKHOANSUDUNG">ĐIỀU KHOẢN SỬ DỤNG</option>
          </select>
          <div class="select-arrow">
            <svg
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- TinyMCE -->
      <div class="control-box">
        <label class="control-label">Nội dung</label>
        <div class="editor-container">
          <editor
            api-key="6q1jkwu75mpqv0rx5y0uj9ldflybe17q9hetjj02lp5skf2t"
            v-model="content"
            :init="{
              height: 'calc(100vh - 300px)',
              min_height: 400,
              skin: 'oxide',
              content_css: 'default',
              menubar: true,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help',
              resize: true,
              statusbar: true,
            }"
          />
        </div>
      </div>

      <!-- Nút Lưu/Sửa -->
      <div class="button-group">
        <button @click="fetchContent" class="btn btn-secondary">
          <svg
            class="btn-icon"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          Làm mới
        </button>
        <button
          @click="saveContent"
          class="btn btn-primary"
          :disabled="loading"
        >
          <svg
            v-if="loading"
            class="btn-icon spinner"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <svg
            v-else
            class="btn-icon"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          {{ currentId ? "Cập nhật" : "Lưu" }}
        </button>
      </div>
    </div>

    <!-- Thông báo -->
    <div v-if="notification.show" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from "vue";
import Editor from "@tinymce/tinymce-vue";
import axios from "/src/utils/axios";

// Khai báo biến
const selectedCategory = ref("VECHUNGTOI");
const content = ref("");
const currentId = ref(null);
const loading = ref(false);
const notification = ref({
  show: false,
  message: "",
  type: "success",
});

// map value -> text
const categoryTextMap = {
  VECHUNGTOI: "VỀ CHÚNG TÔI",
  LIENHE: "LIÊN HỆ",
  HETHONGDAILY: "HỆ THỐNG ĐẠI LÝ",
  CHINHSACHDAILY: "CHÍNH SÁCH ĐẠI LÝ",
  CHINHSACHBAOMAT: "CHÍNH SÁCH BẢO MẬT",
  CHINHSACHGIAONHANHANG: "CHÍNH SÁCH GIAO NHẬN HÀNG",
  HOIDAPDAILY: "HỎI ĐÁP ĐẠI LÝ",
  CHINHSACHDOITRA: "CHÍNH SÁCH ĐỔI TRẢ",
  HOTROKHACHHANG: "HỖ TRỢ KHÁCH HÀNG",
  TRUNGTAMHOTRO: "TRUNG TÂM HỖ TRỢ",
  HUONGDANMUAHANG: "HƯỚNG DẪN MUA HÀNG",
  DIEUKHOANSUDUNG: "ĐIỀU KHOẢN SỬ DỤNG",
};

// computed để lấy text
const selectedCategoryText = computed(() => {
  return categoryTextMap[selectedCategory.value] || "";
});

// Hàm hiển thị thông báo
function showNotification(message, type = "success") {
  notification.value = {
    show: true,
    message,
    type,
  };

  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
}

// Điều chỉnh chiều cao trình soạn thảo
function adjustEditorHeight() {
  const editorIframe = document.querySelector(".tox-edit-area iframe");
  if (editorIframe) {
    const windowHeight = window.innerHeight;
    const position = editorIframe.getBoundingClientRect().top;
    const newHeight = Math.max(400, windowHeight - position - 100);
    editorIframe.style.height = `${newHeight}px`;
  }
}

// Lấy dữ liệu từ API
async function fetchContent() {
  try {
    loading.value = true;
    const response = await axios.get(`/api/MISC?cat=${selectedCategory.value}`);
    if (response.data && response.data.length > 0) {
      content.value = response.data[0].vaL3 || "";
      currentId.value = response.data[0].id;
    } else {
      content.value = "";
      currentId.value = null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy nội dung:", error);
    showNotification("Không thể tải nội dung. Vui lòng thử lại!", "error");
    content.value = "";
    currentId.value = null;
  } finally {
    loading.value = false;
    nextTick(() => {
      adjustEditorHeight();
    });
  }
}

// Lưu nội dung
async function saveContent() {
  try {
    loading.value = true;

    if (currentId.value) {
      await axios.post(`/api/MISC/update/${currentId.value}`, {
        vaL3: content.value,
      });
      showNotification("Cập nhật thành công!");
    } else {
      await axios.post("/api/MISC", {
        cat: selectedCategory.value,
        val: selectedCategoryText.value,
        vaL2: "",
        vaL3: content.value,
        status: "OK",
      });
      await fetchContent();
      showNotification("Lưu thành công!");
    }
  } catch (error) {
    console.error("Lỗi khi lưu nội dung:", error);
    showNotification(
      "Có lỗi xảy ra khi lưu nội dung. Vui lòng thử lại!",
      "error"
    );
  } finally {
    loading.value = false;
  }
}

// Lifecycle
onMounted(() => {
  fetchContent();
  window.addEventListener("resize", adjustEditorHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", adjustEditorHeight);
});
</script>

<style>
/* Reset CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

/* Container */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Page Title */
.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #333;
}

/* Content Layout */
.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Control Box */
.control-box {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.control-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #4b5563;
}

/* Select Styling */
.select-wrapper {
  position: relative;
}

.select-control {
  width: 100%;
  padding: 10px 16px;
  font-size: 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #fff;
  appearance: none;
  outline: none;
  cursor: pointer;
}

.select-control:focus {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
}

.select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6b7280;
}

/* Editor Container */
.editor-container {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
}

/* Button Styles */
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #e74c3c;
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover:not(:disabled) {
  background-color: #d44333;
}

.btn-secondary {
  background-color: #fff;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #f9fafb;
}

.btn-icon {
  margin-right: 8px;
}

/* Spinner Animation */
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Notification */
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 6px;
  color: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.notification.success {
  background-color: #10b981;
}

.notification.error {
  background-color: #ef4444;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* TinyMCE Customization */
.tox-tinymce {
  border-radius: 6px !important;
}

.tox .tox-toolbar,
.tox .tox-toolbar__overflow,
.tox .tox-toolbar__primary {
  background-color: #f9fafb !important;
}

.tox .tox-tbtn {
  border-radius: 4px !important;
}

.tox .tox-statusbar {
  border-top: 1px solid #e5e7eb !important;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}

@media (max-width: 576px) {
  .button-group {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
  }

  .notification {
    left: 20px;
    right: 20px;
    text-align: center;
  }
}
</style>