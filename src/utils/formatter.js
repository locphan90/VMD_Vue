export function formatCurrency(value) {
    if (!value) return '0';
    return value.toLocaleString('vi-VN') + '<span class="currency">đ</span>';
  }
  
  // Format khi nhập form (chỉ số, không thêm ký tự 'đ' khi nhập)
  export function formatInputCurrency(value) {
    // Loại bỏ ký tự không phải số
    const numericValue = value.replace(/\D/g, '');
    return Number(numericValue).toLocaleString('vi-VN');
  }
  