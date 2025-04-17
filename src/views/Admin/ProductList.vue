<template>
  <div class="product-list">
    <h2>Danh sách sản phẩm</h2>

    <!-- Bộ lọc -->
    <div class="filters">
      <select v-model="filters.cat">
        <option value="">Tất cả CAT</option>
        <option value="Mới">Mới</option>
        <option value="Nổi bật">Nổi bật</option>
      </select>

      <select v-model="filters.loai">
        <option value="">Tất cả Loại</option>
        <option value="New">New</option>
        <option value="Sale">Sale</option>
      </select>

      <select v-model="filters.nganh">
        <option value="">Tất cả Ngành</option>
        <option value="FMCG">FMCG</option>
        <option value="Mẹ & Bé">Mẹ & Bé</option>
        <option value="HealthCare">HealthCare</option>
        <option value="Industry">Industry</option>
      </select>
    </div>

    <!-- Bảng sản phẩm -->
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>CAT</th>
          <th>Tên SP</th>
          <th>Giá Tham Khảo</th>
          <th>Mô Tả</th>
          <th>Loại</th>
          <th>Ngành</th>
          <th>File FTP</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.cat }}</td>
          <td>{{ product.tenSP }}</td>
          <td>{{ product.giaThamKhao }}</td>
          <td>{{ product.mota }}</td>
          <td>{{ product.loai }}</td>
          <td>{{ product.nganh }}</td>
          <td>{{ product.fileFTP }}</td>
          <td>
            <button @click="editProduct(product)">Sửa</button>
            <button @click="deleteProduct(product.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  data() {
    return {
      filters: {
        cat: '',
        loai: '',
        nganh: ''
      },
      products: [
        { id: 1, cat: 'Mới', tenSP: 'Sản phẩm A', giaThamKhao: 1000, mota: 'Mô tả A', loai: 'New', nganh: 'FMCG', fileFTP: 'ftp://path/to/fileA.jpg' },
        { id: 2, cat: 'Nổi bật', tenSP: 'Sản phẩm B', giaThamKhao: 2000, mota: 'Mô tả B', loai: 'Sale', nganh: 'HealthCare', fileFTP: 'ftp://path/to/fileB.jpg' },
        { id: 3, cat: 'Mới', tenSP: 'Sản phẩm C', giaThamKhao: 3000, mota: 'Mô tả C', loai: 'New', nganh: 'Mẹ & Bé', fileFTP: 'ftp://path/to/fileC.jpg' }
      ]
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(p => {
        const matchCAT = this.filters.cat === '' || p.cat === this.filters.cat;
        const matchLoai = this.filters.loai === '' || p.loai === this.filters.loai;
        const matchNganh = this.filters.nganh === '' || p.nganh === this.filters.nganh;
        return matchCAT && matchLoai && matchNganh;
      });
    }
  },
  methods: {
    editProduct(product) {
      // Điều hướng đến form nhập sản phẩm và truyền ID sản phẩm
      this.$router.push({ path: '/admin/products', query: { id: product.id } });
    },
    deleteProduct(id) {
      if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
        this.products = this.products.filter(p => p.id !== id);
        alert('Đã xóa sản phẩm thành công!');
      }
    }
  }
};
</script>

<style scoped>
.product-list {
  max-width: 100%;
  padding: 20px;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border: 1px solid #ddd;
}

th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f7f7f7;
}

button {
  margin-right: 5px;
  padding: 4px 8px;
  background-color: #e74c3c;
  border: none;
  color: white;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background-color: #c0392b;
}
</style>
