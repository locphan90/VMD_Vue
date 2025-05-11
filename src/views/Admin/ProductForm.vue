<template>
  <div class="product-form">
    <h2>Nhập sản phẩm</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Mới/Nổi bật</label>
        <select v-model="product.cat">
          <option value="MOI">Mới</option>
          <option value="NOIBAT">Nổi bật</option>
        </select>
      </div>

      <div class="form-group">
        <label>Tên sản phẩm:</label>
        <input type="text" v-model="product.tenSP" required />
      </div>

      <div class="form-group">
        <label>Giá tham khảo:</label>
        <input
          type="text"
          v-model="product.giaThamKhao"
          @input="onPriceInput"
          required
        />
      </div>

      <div class="form-group">
        <label>Mô tả (20 ký tự trở lại như hộp, lon...):</label>
        <input type="text" v-model="product.mota" />
      </div>
      <div class="form-group">
        <label>Chi tiết sản phẩm:</label>
        <editor
          v-model="product.chiTietSP"
          :init="tinymceInit"
          api-key="6q1jkwu75mpqv0rx5y0uj9ldflybe17q9hetjj02lp5skf2t"
        />
      </div>
            <div class="form-group">
        <label>Hướng dẫn sử dụng:</label>
        <editor
          v-model="product.huongDanSD"
          :init="tinymceInit"
          api-key="6q1jkwu75mpqv0rx5y0uj9ldflybe17q9hetjj02lp5skf2t"
        />
      </div>
      <div class="form-group">
        <label>Trạng thái:</label>
        <select v-model="product.loai">
          <option value="Đang kinh doanh">Đang kinh doanh</option>
          <option value="Chưa kinh doanh">Chưa kinh doanh</option>
          <option value="Hết hàng">Hết hàng</option>
        </select>
      </div>

      <div class="form-group">
        <label>Ngành:</label>
        <select v-model="product.nganh">
          <option value="FMCG">FMCG</option>
          <option value="Mẹ & Bé">Mẹ & Bé</option>
          <option value="HealthCare">HealthCare</option>
          <option value="Industry">Industry</option>
        </select>
      </div>

            <div class="form-group">
        <label>Danh mục sản phẩm:</label>
        <select v-model="product.danhMucSP">
          <option
            v-for="item in danhMucList"
            :key="item.val"
            :value="item.val"
          >
            {{ item.val }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Nhãn hiệu:</label>
        <select v-model="product.thuongHieu">
          <option
            v-for="item in thuongHieuList"
            :key="item.val"
            :value="item.val"
          >
            {{ item.val }}
          </option>
        </select>
      </div>

      <!-- Hình ảnh chính sản phẩm -->
      <div class="form-group">
        <label>Hình ảnh chính sản phẩm:</label>
        <div class="file-upload">
          <input type="file" @change="onMainFileChange" ref="mainFileInput" />
          <div v-if="mainFilePreview" class="image-preview">
            <img :src="mainFilePreview" alt="Preview hình chính" />
          </div>
        </div>
      </div>

      <!-- Hình ảnh tham chiếu -->
      <div class="form-group">
        <label>Hình ảnh tham chiếu sản phẩm:</label>
        <div class="file-upload">
          <input
            type="file"
            @change="onReferenceFilesChange"
            multiple
            ref="refFileInput"
          />
          <div class="preview-grid">
            <div
              v-for="(preview, index) in referenceFilePreviews"
              :key="index"
              class="ref-image-preview"
            >
              <img :src="preview" alt="Preview hình tham chiếu" />
              <button
                type="button"
                class="remove-btn"
                @click="removeReferenceFile(index)"
              >
                X
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="product.ShowUp" />
          Hiển thị lên trang chủ
        </label>
      </div>

      <button type="submit">
        {{ isEditing ? "Cập nhật sản phẩm" : "Lưu sản phẩm" }}
      </button>
      <button
        v-if="isEditing"
        type="button"
        class="cancel-btn"
        @click="cancelEdit"
      >
        Hủy
      </button>
    </form>
    <hr style="margin: 40px 0" />

    <!-- Phần tìm kiếm và lọc -->
    <div class="search-filter">
      <h3>Tìm kiếm và lọc sản phẩm</h3>
      <div class="filter-container">
        <div class="filter-group">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Nhập tên sản phẩm..."
            @input="handleSearch"
            class="search-input"
          />
        </div>

        <div class="filter-group">
          <select v-model="filters.cat" @change="applyFilters">
            <option value="">-- Loại --</option>
            <option value="MOI">Mới</option>
            <option value="NOIBAT">Nổi bật</option>
          </select>
        </div>

        <div class="filter-group">
          <select v-model="filters.loai" @change="applyFilters">
            <option value="">-- Phân loại --</option>
            <option value="New">New</option>
            <option value="Sale">Sale</option>
            <option value="Hot">Hot</option>
            <option value="Pre-order">Pre-order</option>
          </select>
        </div>

        <div class="filter-group">
          <select v-model="filters.nganh" @change="applyFilters">
            <option value="">-- Ngành --</option>
            <option value="FMCG">FMCG</option>
            <option value="Mẹ & Bé">Mẹ & Bé</option>
            <option value="HealthCare">HealthCare</option>
            <option value="Industry">Industry</option>
          </select>
        </div>

        <div class="filter-group">
          <select v-model="filters.thuongHieu" @change="applyFilters">
            <option value="">-- Thương hiệu --</option>
            <option
              v-for="item in thuongHieuList"
              :key="item.val"
              :value="item.val"
            >
              {{ item.val }}
            </option>
          </select>
        </div>

        <button @click="resetFilters" class="reset-btn">Đặt lại</button>
      </div>
    </div>

    <!-- Danh sách sản phẩm -->
    <div class="product-table-container">
      <table class="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Loại</th>
            <th>Phân loại</th>
            <th>Giá tham khảo</th>
            <th>Ngành</th>
            <th>Thương hiệu</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in displayedProducts" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.tenSP }}</td>
            <td>{{ item.cat }}</td>
            <td>{{ item.loai }}</td>
            <td>
              {{ item.giaThamKhao.toLocaleString() }}
              <span class="currency">đ</span>
            </td>
            <td>{{ item.nganh }}</td>
            <td>{{ item.thuongHieu }}</td>
            <td class="action-cell">
              <button
                class="edit-btn table-btn"
                @click="editProduct(item)"
                title="Sửa sản phẩm"
              >
                ✎
              </button>
              <button
                class="delete-btn table-btn"
                @click="deleteProduct(item.id)"
                title="Xóa sản phẩm"
              >
                X
              </button>
            </td>
          </tr>
          <tr v-if="displayedProducts.length === 0">
            <td colspan="8" class="no-data">Không có sản phẩm nào</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div class="pagination">
      <!-- Nút lùi trang -->
      <span>
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-btn nav-btn"
        >
          &lt;
        </button>
      </span>

      <span v-for="page in displayedPages" :key="page">
        <button
          v-if="page !== '...'"
          @click="changePage(page)"
          :class="['page-btn', page === currentPage ? 'active' : '']"
        >
          {{ page }}
        </button>
        <span v-else class="ellipsis">...</span>
      </span>

      <!-- Nút qua trang -->
      <span>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="page-btn nav-btn"
        >
          &gt;
        </button>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "@/utils/axios";
import { formatInputCurrency } from "@/utils/formatter";
import getFullFtpUrl from "@/utils/pathHelper";
import Editor from '@tinymce/tinymce-vue';

const thuongHieuList = ref([]);
const danhMucList = ref([]);
const isEditing = ref(false);
const editingProductId = ref(null);
const mainFilePreview = ref(null);
const referenceFilePreviews = ref([]);
const referenceFiles = ref([]);
const mainFileInput = ref(null);
const refFileInput = ref(null);

// TinyMCE Configuration
const tinymceInit = {
  height: 300,
  menubar: true,
  plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
  ],
  toolbar:
    'undo redo | formatselect | bold italic backcolor | \
    alignleft aligncenter alignright alignjustify | \
    bullist numlist outdent indent | removeformat | help'
};

// Trang hiện tại và số sản phẩm trên mỗi trang
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = ref(1);

// Tìm kiếm và lọc
const searchQuery = ref("");
const filters = ref({
  cat: "",
  loai: "",
  nganh: "",
  thuongHieu: "",
});

// Tạo TRX ngẫu nhiên
const generateTRX = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const trxHinhAnh = ref(generateTRX());
const productHinhAnhThamChieu = ref([]);

const fetchThuongHieu = async () => {
  try {
    const res = await axios.get("/api/MISC?cat=THUONGHIEU");
    thuongHieuList.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải thương hiệu:", err);
  }
};

const fetchDanhMucSP = async () => {
  try {
    const res = await axios.get("/api/MISC?cat=DANHMUCSANPHAM");
    danhMucList.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải danh mục sản phẩm:", err);
  }
};

const product = ref({
  cat: "MOI",
  tenSP: "",
  giaThamKhao: "",
  mota: "",
  chiTietSP: "",
  huongDanSD:"",
  thuongHieu: "",
  loai: "New",
  nganh: "FMCG",
  fileFTP: "",
  showUp: false,
});

const selectedFile = ref(null);
const allProducts = ref([]);
const filteredProducts = ref([]);

// Lấy danh sách sản phẩm hiển thị dựa trên phân trang
const displayedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredProducts.value.slice(startIndex, endIndex);
});

// Tính toán số trang và hiển thị số trang trên UI
const displayedPages = computed(() => {
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }

  const pages = [];
  if (currentPage.value <= 3) {
    for (let i = 1; i <= 5; i++) {
      pages.push(i);
    }
    pages.push("...");
    pages.push(totalPages.value);
  } else if (currentPage.value >= totalPages.value - 2) {
    pages.push(1);
    pages.push("...");
    for (let i = totalPages.value - 4; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    pages.push("...");
    for (let i = currentPage.value - 1; i <= currentPage.value + 1; i++) {
      pages.push(i);
    }
    pages.push("...");
    pages.push(totalPages.value);
  }

  return pages;
});

const onPriceInput = (event) => {
  product.value.giaThamKhao = formatInputCurrency(event.target.value);
};

const onMainFileChange = (event) => {
  selectedFile.value = event.target.files[0];
  if (selectedFile.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      mainFilePreview.value = e.target.result;
    };
    reader.readAsDataURL(selectedFile.value);
  } else {
    mainFilePreview.value = null;
  }
};

const onReferenceFilesChange = (event) => {
  const newFiles = Array.from(event.target.files);

  // Thêm files mới vào danh sách
  referenceFiles.value = [...referenceFiles.value, ...newFiles];

  // Tạo previews cho các files mới
  newFiles.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      referenceFilePreviews.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

const removeReferenceFile = (index) => {
  referenceFiles.value.splice(index, 1);
  referenceFilePreviews.value.splice(index, 1);
};

const handleSubmit = async () => {
  if (!selectedFile.value && !isEditing.value) {
    alert("Vui lòng chọn file hình ảnh chính cho sản phẩm!");
    return;
  }

  // Kiểm tra độ dài của chiTietSP
  if (product.value.chiTietSP && product.value.chiTietSP.length > 4000) {
    alert("Chi tiết sản phẩm không được vượt quá 4000 ký tự!");
    return;
  }

  // Kiểm tra độ dài của chiTietSP
  if (product.value.huongDanSD && product.value.huongDanSD.length > 4000) {
    alert("Hướng dẫn sử dụng không được vượt quá 4000 ký tự!");
    return;
  }

  try {
    let sanPhamID;

    // Xử lý hình ảnh chính nếu có thay đổi
    if (selectedFile.value) {
      const formData = new FormData();
      formData.append("file", selectedFile.value);

      const uploadRes = await axios.post("/api/ftp/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      product.value.fileFTP = uploadRes.data.filePath;
    }

    const cleanGia = Number(
      product.value.giaThamKhao.toString().replace(/\D/g, "")
    );
    const payload = {
      ...product.value,
      giaThamKhao: cleanGia,
      // chiTietSP already contains HTML from TinyMCE
    };

    // Nếu đang sửa hoặc tạo mới sản phẩm
    if (isEditing.value) {
      await axios.post(
        `/api/sanpham/update/${editingProductId.value}`,
        payload
      );
      sanPhamID = editingProductId.value;
    } else {
      const res = await axios.post("/api/sanpham", payload);
      sanPhamID = res.data.id; // Giả định API trả về ID của sản phẩm vừa tạo
    }

    // Xử lý upload tất cả hình ảnh tham chiếu
    if (referenceFiles.value.length > 0) {
      const referenceData = [];

      for (const file of referenceFiles.value) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await axios.post("/api/ftp/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        referenceData.push({
          SanPhamID: sanPhamID,
          LinkHinhAnh: uploadRes.data.filePath,
          FstUser: 1, // Có thể thay đổi tùy theo yêu cầu
          FstUpdate: new Date(),
          Status: "OK",
          TRXHinhAnh: trxHinhAnh.value,
        });
      }

      // Gửi tất cả hình ảnh tham chiếu cùng một lần
      await axios.post("/api/HinhAnhSanPham", referenceData);

      // Gọi API cập nhật SanPhamID cho các hình ảnh tham chiếu
      await axios.post("/api/HinhAnhSanPham/UpdateBySanPham", {
        SanPhamID: sanPhamID,
        TRXHinhAnh: trxHinhAnh.value,
      });
    }

    alert(
      isEditing.value
        ? "Cập nhật sản phẩm thành công!"
        : "Thêm sản phẩm thành công!"
    );
    resetForm();
    await fetchAllProducts();
  } catch (error) {
    console.error(
      isEditing.value ? "Lỗi khi cập nhật sản phẩm:" : "Lỗi khi lưu sản phẩm:",
      error.response?.data || error
    );
    alert(
      isEditing.value
        ? "Có lỗi xảy ra khi cập nhật sản phẩm!"
        : "Có lỗi xảy ra khi lưu sản phẩm!"
    );
  }
};

const resetForm = () => {
  product.value = {
    cat: "MOI",
    tenSP: "",
    giaThamKhao: "",
    mota: "",
    chiTietSP: "",
    huongDanSD: "",
    loai: "New",
    nganh: "FMCG",
    danhMucSP:"",
    thuongHieu: "",
    fileFTP: "",
    showUp: false,
  };
  selectedFile.value = null;
  mainFilePreview.value = null;
  referenceFiles.value = [];
  referenceFilePreviews.value = [];
  isEditing.value = false;
  editingProductId.value = null;
  trxHinhAnh.value = generateTRX();
  productHinhAnhThamChieu.value = [];

  // Reset file inputs
  if (mainFileInput.value) mainFileInput.value.value = "";
  if (refFileInput.value) refFileInput.value.value = "";
};

// Lấy tất cả sản phẩm
const fetchAllProducts = async () => {
  try {
    const res = await axios.get("/api/sanpham");
    allProducts.value = res.data
      .filter((sp) => sp.status !== "XX")
      .map((sp) => ({
        ...sp,
        fileFTP: getFullFtpUrl(sp.fileFTP),
      }));
    applyFilters();
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
  }
};

const fetchProductImages = async (productId) => {
  try {
    const res = await axios.get(`/api/HinhAnhSanPham/sanpham/${productId}`);
    productHinhAnhThamChieu.value = res.data.map((img) => ({
      ...img,
      linkHinhAnh: getFullFtpUrl(img.linkHinhAnh),
    }));
    // Hiển thị preview các hình ảnh tham chiếu đã có
    referenceFilePreviews.value = productHinhAnhThamChieu.value.map(
      (img) => img.linkHinhAnh
    );
  } catch (err) {
    console.error("Lỗi khi tải hình ảnh tham chiếu:", err);
    productHinhAnhThamChieu.value = [];
  }
};

const editProduct = async (item) => {
  try {
    isEditing.value = true;
    editingProductId.value = item.id;

    // Điền thông tin sản phẩm vào form
    product.value = {
      cat: item.cat || "MOI",
      tenSP: item.tenSP || "",
      giaThamKhao: item.giaThamKhao ? item.giaThamKhao.toLocaleString() : "",
      mota: item.mota || "",
      chiTietSP: item.chiTietSP || "",
      huongDanSD: item.huongDanSD || "",
      danhMucSP: item.danhMucSP || "",
      thuongHieu: item.thuongHieu || "",
      loai: item.loai || "New",
      nganh: item.nganh || "FMCG",
      fileFTP: item.fileFTP || "",
      showUp: item.showUp || false,
    };

    // Hiển thị preview hình ảnh chính
    mainFilePreview.value = item.fileFTP;

    // Lấy và hiển thị preview các hình ảnh tham chiếu
    await fetchProductImages(item.id);

    // Tạo TRX mới cho phiên chỉnh sửa
    trxHinhAnh.value = generateTRX();

    // Cuộn trang lên trên để người dùng thấy form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } catch (error) {
    console.error("Lỗi khi chỉnh sửa sản phẩm:", error);
    alert("Có lỗi xảy ra khi tải thông tin sản phẩm!");
  }
};

const cancelEdit = () => {
  resetForm();
};

const deleteProduct = async (id) => {
  if (confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
    try {
      await axios.post(`/api/sanpham/update/${id}`, {
        status: "XX",
      });
      fetchAllProducts();
    } catch (error) {
      console.error("Lỗi khi xoá:", error);
    }
  }
};

// Chức năng tìm kiếm
const handleSearch = () => {
  currentPage.value = 1;
  applyFilters();
};

// Chức năng lọc
const applyFilters = () => {
  let results = [...allProducts.value];

  // Lọc theo từ khóa tìm kiếm
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    results = results.filter(
      (item) =>
        item.tenSP?.toLowerCase().includes(query) ||
        item.mota?.toLowerCase().includes(query)
    );
  }

  // Lọc theo các tiêu chí khác
  if (filters.value.cat) {
    results = results.filter((item) => item.cat === filters.value.cat);
  }

  if (filters.value.loai) {
    results = results.filter((item) => item.loai === filters.value.loai);
  }

  if (filters.value.nganh) {
    results = results.filter((item) => item.nganh === filters.value.nganh);
  }

  if (filters.value.thuongHieu) {
    results = results.filter(
      (item) => item.thuongHieu === filters.value.thuongHieu
    );
  }

  filteredProducts.value = results;
  totalPages.value =
    Math.ceil(filteredProducts.value.length / itemsPerPage.value) || 1;

  // Kiểm tra xem trang hiện tại có vượt quá số trang sau khi lọc không
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
};

// Reset bộ lọc
const resetFilters = () => {
  searchQuery.value = "";
  filters.value = {
    cat: "",
    loai: "",
    nganh: "",
    thuongHieu: "",
  };
  applyFilters();
};

// Chuyển trang
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Watch để cập nhật khi có sự thay đổi trong danh sách sản phẩm
watch([allProducts], () => {
  applyFilters();
});

onMounted(() => {
  fetchAllProducts();
  fetchThuongHieu();
  fetchDanhMucSP();
});
</script>

<style scoped>
.product-form {
  max-width: 1000px;
  margin: 50px auto;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.product-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 600;
}

input,
select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus,
select:focus {
  border-color: #e74c3c;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #e74c3c;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
  margin-bottom: 10px;
}

button:hover {
  background-color: #c0392b;
}

.edit-btn {
  background-color: #3498db;
  color: white;
  border: none;
}

.cancel-btn {
  background-color: #7f8c8d;
}

.cancel-btn:hover {
  background-color: #636e72;
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 8px;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
}

textarea:focus {
  border-color: #e74c3c;
  outline: none;
}

/* Phần style mới cho Preview hình ảnh */
.file-upload {
  margin-top: 10px;
}

.image-preview {
  margin-top: 15px;
  max-width: 100%;
  height: 200px;
  border: 1px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.ref-image-preview {
  width: calc(25% - 8px);
  height: 100px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.ref-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.ref-image-preview .remove-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(231, 76, 60, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.ref-image-preview .remove-btn:hover {
  background: rgba(192, 57, 43, 1);
}

/* Phần style mới cho bảng và phân trang */
.search-filter {
  margin-bottom: 30px;
}

.search-filter h3 {
  margin-bottom: 15px;
  color: #333;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.filter-group {
  flex: 1;
  min-width: 150px;
}

.search-input {
  width: 100%;
}

.reset-btn {
  background-color: #3498db;
  padding: 10px 15px;
  width: auto;
  margin-bottom: 0;
}

.reset-btn:hover {
  background-color: #2980b9;
}

.product-table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  border-radius: 5px;
  overflow: hidden;
}

.product-table th,
.product-table td {
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
}

.product-table th {
  background-color: #f4f4f4;
  font-weight: 600;
  color: #555;
}

.product-table tr:hover {
  background-color: #f9f9f9;
}

.product-table .no-data {
  text-align: center;
  padding: 20px;
  color: #888;
}

.action-cell {
  white-space: nowrap;
  width: 100px;
}

.table-btn {
  width: 32px;
  height: 32px;
  margin: 0 5px 0 0;
  padding: 0;
  line-height: 32px;
  border-radius: 4px;
  font-size: 16px;
}

.currency {
  font-size: 0.85em;
  vertical-align: super;
}

/* Phân trang */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 5px;
  flex-wrap: wrap;
  flex-wrap: nowrap; /* Ngăn chia dòng */
}

.page-btn {
  min-width: 40px;
  height: 40px;
  margin: 0;
  padding: 0 10px;
  background-color: #f4f4f4;
  color: #333;
  border: 1px solid #ddd;
}

.page-btn:hover {
  background-color: #e0e0e0;
}

.page-btn.active {
  background-color: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

.page-btn:disabled {
  background-color: #f4f4f4;
  color: #aaa;
  cursor: not-allowed;
}

.ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  font-size: 14px;
  color: #333;
}
.pagination > span {
  display: flex;
  align-items: center;
}
.pagination button,
.pagination .ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  background-color: #c0392b;
  color: white;
}

.page-btn.active {
  background-color: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

@media (max-width: 992px) {
  .filter-group {
    min-width: calc(50% - 10px);
  }

  .ref-image-preview {
    width: calc(33.33% - 7px);
  }
}

@media (max-width: 600px) {
  .filter-group {
    min-width: 100%;
  }

  .ref-image-preview {
    width: calc(50% - 5px);
  }

  .pagination {
    gap: 3px;
  }

  .page-btn {
    min-width: 35px;
    height: 35px;
    font-size: 14px;
  }
}
</style>