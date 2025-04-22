<template>
  <div class="banner-management">
    <h1 class="page-title">Quản lý Banner</h1>

    <!-- Banner Chính -->
    <div class="section banner-main">
      <h2>Banner Chính</h2>
      
      <!-- Upload Banner Chính -->
      <div class="upload-section">
        <label for="main-banner-upload" class="upload-btn">
          <span>Chọn hình banner chính</span>
          <input
            type="file"
            id="main-banner-upload"
            @change="handleMainBannerUpload"
            multiple
            accept="image/*"
          />
        </label>
        <div v-if="uploadingMain" class="uploading-status">
          <div class="spinner"></div>
          <span>Đang tải lên...</span>
        </div>
      </div>

      <!-- Link Banner Chính -->
      <div class="link-input-section">
        <label for="main-banner-link">Link trang web:</label>
        <input
          type="text"
          id="main-banner-link"
          v-model="mainBannerLink"
          placeholder="Nhập link trang web khi click vào banner"
          class="link-input"
        />
      </div>

      <!-- Danh sách Banner Chính -->
      <div class="banner-list">
        <h3>Danh sách Banner Chính</h3>
        <div v-if="loadingMainBanners" class="loading">
          <div class="spinner"></div>
          <span>Đang tải dữ liệu...</span>
        </div>
        <div v-else-if="mainBanners.length === 0" class="no-data">
          Chưa có banner nào được tải lên
        </div>
        <div v-else class="banner-grid">
          <div
            v-for="banner in mainBanners"
            :key="banner.id"
            class="banner-item"
          >
            <div class="banner-image">
              <img :src="banner.vaL2" :alt="`Banner ${banner.id}`" />
            </div>
            <div class="banner-info">
              <div class="banner-link" v-if="banner.vaL3">
                <strong>Link:</strong> <span class="link-text">{{ banner.vaL3 }}</span>
              </div>
            </div>
            <div class="banner-actions">
              <button
                @click="toggleBannerStatus(banner)"
                :class="['status-btn', banner.status === 'OK' ? 'active' : '']"
              >
                {{ banner.status === "OK" ? "Đang hiện" : "Đang ẩn" }}
              </button>
              <button
                @click="deleteBanner(banner)"
                class="delete-btn"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Banner Phụ -->
    <div class="section banner-secondary">
      <h2>Banner Phụ</h2>
      
      <div class="secondary-banners">
        <!-- Secondary banner 1 -->
        <div class="secondary-banner-item">
          <h3>Banner Phụ 1</h3>
          <div class="upload-section">
            <label for="secondary-banner-1" class="upload-btn">
              <span>Chọn hình</span>
              <input
                type="file"
                id="secondary-banner-1"
                @change="(e) => handleSecondaryBannerUpload(e, 2)"
                accept="image/*"
              />
            </label>
            <div v-if="uploadingSecondary[0]" class="uploading-status">
              <div class="spinner"></div>
              <span>Đang tải lên...</span>
            </div>
          </div>
          <!-- Link Banner Phụ 1 -->
          <div class="link-input-section">
            <label for="secondary-banner-link-1">Link trang web:</label>
            <input
              type="text"
              id="secondary-banner-link-1"
              v-model="secondaryBannerLinks[0]"
              placeholder="Nhập link trang web"
              class="link-input"
            />
          </div>
        </div>

        <!-- Secondary banner 2 -->
        <div class="secondary-banner-item">
          <h3>Banner Phụ 2</h3>
          <div class="upload-section">
            <label for="secondary-banner-2" class="upload-btn">
              <span>Chọn hình</span>
              <input
                type="file"
                id="secondary-banner-2"
                @change="(e) => handleSecondaryBannerUpload(e, 3)"
                accept="image/*"
              />
            </label>
            <div v-if="uploadingSecondary[1]" class="uploading-status">
              <div class="spinner"></div>
              <span>Đang tải lên...</span>
            </div>
          </div>
          <!-- Link Banner Phụ 2 -->
          <div class="link-input-section">
            <label for="secondary-banner-link-2">Link trang web:</label>
            <input
              type="text"
              id="secondary-banner-link-2"
              v-model="secondaryBannerLinks[1]"
              placeholder="Nhập link trang web"
              class="link-input"
            />
          </div>
        </div>

        <!-- Secondary banner 3 -->
        <div class="secondary-banner-item">
          <h3>Banner Phụ 3</h3>
          <div class="upload-section">
            <label for="secondary-banner-3" class="upload-btn">
              <span>Chọn hình</span>
              <input
                type="file"
                id="secondary-banner-3"
                @change="(e) => handleSecondaryBannerUpload(e, 4)"
                accept="image/*"
              />
            </label>
            <div v-if="uploadingSecondary[2]" class="uploading-status">
              <div class="spinner"></div>
              <span>Đang tải lên...</span>
            </div>
          </div>
          <!-- Link Banner Phụ 3 -->
          <div class="link-input-section">
            <label for="secondary-banner-link-3">Link trang web:</label>
            <input
              type="text"
              id="secondary-banner-link-3"
              v-model="secondaryBannerLinks[2]"
              placeholder="Nhập link trang web"
              class="link-input"
            />
          </div>
        </div>
      </div>

      <!-- Preview khu vực Banner Phụ -->
      <div class="secondary-preview">
        <h3>Xem trước banner phụ</h3>
        <div class="preview-container">
          <div v-for="(banner, index) in secondaryBanners" :key="index" class="preview-item">
            <img v-if="banner" :src="banner.vaL2" :alt="`Preview Banner ${index + 1}`" />
            <div v-else class="empty-preview">
              <span>Chưa có banner</span>
            </div>
            <div v-if="banner && banner.vaL3" class="preview-link">
              <strong>Link:</strong> {{ banner.vaL3 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Thông báo -->
    <div v-if="notification.show" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/axios';
import getFullFtpUrl from "@/utils/pathHelper";

// State cho Banner Chính
const mainBanners = ref([]);
const loadingMainBanners = ref(true);
const uploadingMain = ref(false);
const mainBannerLink = ref('');

// State cho Banner Phụ
const secondaryBanners = ref([null, null, null]);
const secondaryBannerLinks = ref(['', '', '']);
const uploadingSecondary = ref([false, false, false]);

// State cho thông báo
const notification = ref({
  show: false,
  message: '',
  type: 'success'
});

// Lấy dữ liệu banner khi component được mount
onMounted(async () => {
  await fetchBanners();
});

// Hàm lấy dữ liệu banner từ API - đã sửa để chuyển đổi URLs và lấy link (vaL3)
const fetchBanners = async () => {
  try {
    loadingMainBanners.value = true;
    
    // Lấy banner chính
    const mainResponse = await axios.get('api/MISC?cat=BANNER');
    if (mainResponse.data) {
      // Lọc banner chính (val=1 và status=OK hoặc status=NA)
      // Xử lý để chuyển đổi vaL2 thành đường dẫn đầy đủ bằng hàm getFullFtpUrl
      mainBanners.value = mainResponse.data
        .filter(banner => banner.val === '1' && (banner.status === 'OK' || banner.status === 'NA'))
        .map(banner => ({
          ...banner,
          vaL2: getFullFtpUrl(banner.vaL2) // Chuyển đổi URL để hiển thị hình ảnh
        }));
      
      // Lấy banner phụ (val=2, val=3, val=4)
      const secondary1 = mainResponse.data.find(banner => banner.val === '2');
      const secondary2 = mainResponse.data.find(banner => banner.val === '3');
      const secondary3 = mainResponse.data.find(banner => banner.val === '4');
      
      // Chuyển đổi các URL của banner phụ nếu tồn tại và lấy giá trị vaL3
      secondaryBanners.value = [
        secondary1 ? { ...secondary1, vaL2: getFullFtpUrl(secondary1.vaL2) } : null,
        secondary2 ? { ...secondary2, vaL2: getFullFtpUrl(secondary2.vaL2) } : null,
        secondary3 ? { ...secondary3, vaL2: getFullFtpUrl(secondary3.vaL2) } : null
      ];
      
      // Cập nhật giá trị của link cho banner phụ
      secondaryBannerLinks.value = [
        secondary1?.vaL3 || '',
        secondary2?.vaL3 || '',
        secondary3?.vaL3 || ''
      ];
    }
  } catch (error) {
    showNotification('Lỗi khi tải dữ liệu banner', 'error');
    console.error('Error fetching banners:', error);
  } finally {
    loadingMainBanners.value = false;
  }
};

// Hàm xử lý upload banner chính
const handleMainBannerUpload = async (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  
  try {
    uploadingMain.value = true;
    
    // Upload từng file lên FTP
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload file lên FTP
      const ftpResponse = await axios.post('api/ftp/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (ftpResponse.data && ftpResponse.data.filePath) {
        // Lưu đường dẫn gốc và link vào database
        await axios.post('api/MISC', {
          cat: 'BANNER',
          val: '1',
          vaL2: ftpResponse.data.filePath, // Lưu URL gốc từ API trả về
          vaL3: mainBannerLink.value, // Lưu link trang web
          status: 'OK'
        });
      }
    }
    
    // Refresh danh sách banner sau khi upload
    await fetchBanners();
    showNotification('Tải lên banner chính thành công', 'success');
    
    // Reset input file và link
    event.target.value = '';
    mainBannerLink.value = '';
    
  } catch (error) {
    showNotification('Lỗi khi tải lên banner chính', 'error');
    console.error('Error uploading main banners:', error);
  } finally {
    uploadingMain.value = false;
  }
};

// Hàm xử lý upload banner phụ
const handleSecondaryBannerUpload = async (event, valIndex) => {
  const file = event.target.files[0];
  if (!file) return;

  const secondaryIndex = valIndex - 2; // Chuyển từ val (2,3,4) sang index array (0,1,2)

  try {
    uploadingSecondary.value[secondaryIndex] = true;

    // Upload file lên FTP
    const formData = new FormData();
    formData.append('file', file);

    const ftpResponse = await axios.post('api/ftp/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (ftpResponse.data && ftpResponse.data.filePath) {
      const existingBanner = secondaryBanners.value[secondaryIndex];
      const originalUrl = ftpResponse.data.filePath;
      const linkUrl = secondaryBannerLinks.value[secondaryIndex];

      if (existingBanner) {
        // Cập nhật banner phụ hiện có bằng POST /update/{id}
        await axios.post(`api/MISC/update/${existingBanner.id}`, {
          vaL2: originalUrl,
          vaL3: linkUrl
        });
      } else {
        // Tạo banner phụ mới nếu chưa có
        await axios.post('api/MISC', {
          cat: 'BANNER',
          val: valIndex.toString(),
          vaL2: originalUrl,
          vaL3: linkUrl,
          status: 'OK'
        });
      }

      // Làm mới danh sách banner
      await fetchBanners();
      showNotification(`Tải lên banner phụ ${secondaryIndex + 1} thành công`, 'success');
    }

    // Reset input file
    event.target.value = '';
  } catch (error) {
    showNotification(`Lỗi khi tải lên banner phụ ${secondaryIndex + 1}`, 'error');
    console.error(`Error uploading secondary banner ${secondaryIndex + 1}:`, error);
  } finally {
    uploadingSecondary.value[secondaryIndex] = false;
  }
};


// Hàm cập nhật chỉ link của banner phụ (không cần upload lại hình)
const updateSecondaryBannerLink = async (index) => {
  const banner = secondaryBanners.value[index];
  const linkUrl = secondaryBannerLinks.value[index];
  
  if (!banner) return;

  try {
    await axios.post(`/api/MISC/update/${banner.id}`, {
      vaL3: linkUrl // Chỉ cập nhật link
    });

    // Cập nhật UI
    secondaryBanners.value[index].vaL3 = linkUrl;

    showNotification(`Cập nhật link banner phụ ${index + 1} thành công`, 'success');
  } catch (error) {
    showNotification(`Lỗi khi cập nhật link banner phụ ${index + 1}`, 'error');
    console.error(`Error updating secondary banner ${index + 1} link:`, error);
  }
};


// Hàm toggle trạng thái banner (hiện/ẩn)
const toggleBannerStatus = async (banner) => {
  try {
    const newStatus = banner.status === 'OK' ? 'NA' : 'OK';

    await axios.post(`api/MISC/update/${banner.id}`, {
      status: newStatus,
    });

    // Cập nhật UI
    const index = mainBanners.value.findIndex(b => b.id === banner.id);
    if (index !== -1) {
      mainBanners.value[index].status = newStatus;
    }

    showNotification(
      `Banner đã được ${newStatus === 'OK' ? 'hiện' : 'ẩn'} thành công`,
      'success'
    );
  } catch (error) {
    showNotification('Lỗi khi thay đổi trạng thái banner', 'error');
    console.error('Error toggling banner status:', error);
  }
};


// Hàm xóa banner
// const deleteBanner = async (banner) => {
//   if (!confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
  
//   try {
//     await axios.put(`api/MISC/${banner.id}`, {
//       ...banner,
//       status: 'XX'
//     });
    
//     // Xóa banner khỏi danh sách
//     mainBanners.value = mainBanners.value.filter(b => b.id !== banner.id);
    
//     showNotification('Xóa banner thành công', 'success');
//   } catch (error) {
//     showNotification('Lỗi khi xóa banner', 'error');
//     console.error('Error deleting banner:', error);
//   }
// };
const deleteBanner = async (banner) => {
  if (!confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
  
  try {
    await axios.post(`api/MISC/update/${banner.id}`, {
      ...banner,
      status: 'XX'
    });
    
    // Xóa banner khỏi danh sách
    mainBanners.value = mainBanners.value.filter(b => b.id !== banner.id);
    
    showNotification('Xóa banner thành công', 'success');
  } catch (error) {
    showNotification('Lỗi khi xóa banner', 'error');
    console.error('Error deleting banner:', error);
  }
};

// Hàm hiển thị thông báo
const showNotification = (message, type = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  };
  
  // Tự động ẩn thông báo sau 3 giây
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};
</script>

<style scoped>
.banner-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.page-title {
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
  border-bottom: 2px solid #e74c3c;
  padding-bottom: 10px;
}

.section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
}

.section h2 {
  color: #e74c3c;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 22px;
}

.section h3 {
  color: #333;
  margin-top: 15px;
  margin-bottom: 15px;
  font-size: 18px;
}

/* Upload Section */
.upload-section {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

/* Link Input Section - New */
.link-input-section {
  margin-bottom: 20px;
}

.link-input-section label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-size: 14px;
}

.link-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.link-input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 3px rgba(52, 152, 219, 0.3);
}

.upload-btn {
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: #2980b9;
}

.upload-btn input[type="file"] {
  display: none;
}

.uploading-status {
  display: flex;
  align-items: center;
  margin-left: 15px;
  color: #666;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Banner List */
.banner-list {
  margin-top: 20px;
}

.loading, .no-data {
  padding: 20px;
  text-align: center;
  color: #666;
  background: #f9f9f9;
  border-radius: 4px;
}

.banner-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.banner-item {
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.banner-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.banner-image {
  height: 150px;
  overflow: hidden;
}

.banner-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.banner-item:hover .banner-image img {
  transform: scale(1.05);
}

/* Banner Info - New */
.banner-info {
  padding: 10px;
  background: #f0f0f0;
  border-top: 1px solid #ddd;
  font-size: 13px;
}

.banner-link {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-text {
  color: #3498db;
}

.banner-actions {
  display: flex;
  padding: 10px;
  background: #f8f8f8;
}

.status-btn, .delete-btn {
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
}

.status-btn {
  flex: 1;
  background: #aaa;
  color: white;
  margin-right: 8px;
}

.status-btn.active {
  background: #2ecc71;
}

.delete-btn {
  background: #e74c3c;
  color: white;
}

.status-btn:hover {
  background: #2ecc71;
}

.delete-btn:hover {
  background: #c0392b;
}

/* Secondary Banners */
.secondary-banners {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.secondary-banner-item {
  background: #f8f8f8;
  padding: 15px;
  border-radius: 6px;
}

.secondary-preview {
  margin-top: 30px;
}

.preview-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.preview-item {
  height: 220px; /* Increased height to accommodate link text */
  background: #f8f8f8;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.preview-item img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.preview-link {
  padding: 8px;
  font-size: 13px;
  color: #333;
  background: #f0f0f0;
  border-top: 1px solid #ddd;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-style: italic;
}

/* Notification */
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  z-index: 1000;
  max-width: 300px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification.success {
  background-color: #2ecc71;
}

.notification.error {
  background-color: #e74c3c;
}

/* Responsive Design */
@media (max-width: 768px) {
  .banner-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  
  .secondary-banners,
  .preview-container {
    grid-template-columns: 1fr;
  }
  
  .preview-item {
    height: 200px;
  }
  
  .preview-item img {
    height: 160px;
  }
}
</style>