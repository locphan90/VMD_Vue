<template>
  <div class="container">
    <h1 class="title">Quản lý trang giới thiệu đại lý</h1>
    
    <div class="image-section">
      <div class="image-preview" v-if="imageUrl">
        <img :src="imageUrl" alt="Ảnh đại lý" />
      </div>
      
      <div class="form-group">
        <label class="form-label">Hình ảnh đại lý</label>
        <input type="file" @change="handleFileUpload" accept="image/*" class="file-input" />
        <div v-if="uploading" class="upload-status">Đang tải lên...</div>
      </div>
    </div>
    
    <div class="form-group">
      <label class="form-label">Nội dung giới thiệu</label>
      <div class="editor-container">
        <editor
          api-key="your-tinymce-api-key"
          v-model="content"
          :init="editorConfig"
        />
      </div>
    </div>
    
    <div class="button-group">
      <button 
        @click="saveData" 
        class="btn btn-primary"
        :disabled="loading"
      >
        {{ loading ? 'Đang lưu...' : 'Lưu thay đổi' }}
      </button>
      
      <button 
        @click="resetForm" 
        class="btn btn-secondary"
      >
        Hủy
      </button>
    </div>
    
    <div v-if="message" class="message" :class="messageClass">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Editor from '@tinymce/tinymce-vue'

// State
const id = ref(null)
const imageUrl = ref('')
const content = ref('')
const file = ref(null)

const loading = ref(false)
const uploading = ref(false)

const message = ref('')
const messageClass = ref('')

const editorConfig = {
  height: 400,
  menubar: true,
  plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
  ],
  toolbar:
    'undo redo | formatselect | bold italic backcolor | ' +
    'alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | removeformat | help'
}

// Methods
const fetchData = async () => {
  try {
    loading.value = true
    const response = await axios.get('api/misc', {
      params: { cat: 'GIOITHIEUDAILY' }
    })

    if (response.data && response.data.length > 0) {
      const data = response.data[0]
      id.value = data.id
      imageUrl.value = data.vaL2 || ''
      content.value = data.vaL3 || ''
    }
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error)
  } finally {
    loading.value = false
  }
}

const handleFileUpload = async (event) => {
  const selectedFile = event.target.files[0]
  if (!selectedFile) return

  file.value = selectedFile

  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target.result
  }
  reader.readAsDataURL(selectedFile)

  await uploadFile()
}

const uploadFile = async () => {
  if (!file.value) return

  try {
    uploading.value = true

    const formData = new FormData()
    formData.append('file', file.value)

    const response = await axios.post('api/ftp/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (response.data && response.data.url) {
      imageUrl.value = response.data.url
      showMessage('Tải ảnh lên thành công', 'success')
    }
  } catch (error) {
    console.error('Lỗi khi upload file:', error)
    showMessage('Lỗi khi tải ảnh lên', 'error')
  } finally {
    uploading.value = false
  }
}

const saveData = async () => {
  try {
    loading.value = true

    const data = {
      cat: 'GIOITHIEUDAILY',
      val: '',
      vaL2: imageUrl.value,
      vaL3: content.value
    }

    if (id.value) {
      await axios.put(`api/misc/${id.value}`, data)
      showMessage('Cập nhật thông tin thành công', 'success')
    } else {
      const response = await axios.post('api/misc', data)
      id.value = response.data.id
      showMessage('Tạo thông tin thành công', 'success')
    }
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu:', error)
    showMessage('Lỗi khi lưu dữ liệu', 'error')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  fetchData()
  showMessage('Đã hủy thay đổi và tải lại dữ liệu', 'info')
}

const showMessage = (msg, type = 'info') => {
  message.value = msg

  switch (type) {
    case 'success':
      messageClass.value = 'message-success'
      break
    case 'error':
      messageClass.value = 'message-error'
      break
    default:
      messageClass.value = 'message-info'
  }

  setTimeout(() => {
    message.value = ''
  }, 3000)
}

// Lifecycle
onMounted(fetchData)
</script>


<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
}

.image-section {
  margin-bottom: 24px;
}

.image-preview {
  background-color: #f3f4f6;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.image-preview img {
  max-width: 500px;
  margin: 0 auto;
  display: block;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.file-input {
  border: 1px solid #d1d5db;
  padding: 8px;
  width: 100%;
  border-radius: 4px;
}

.editor-container {
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 16px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  border: none;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #d1d5db;
  color: #1f2937;
}

.btn-secondary:hover {
  background-color: #9ca3af;
}

.upload-status {
  margin-top: 8px;
  color: #2563eb;
}

.message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 4px;
}

.message-success {
  background-color: #dcfce7;
  color: #166534;
}

.message-error {
  background-color: #fee2e2;
  color: #b91c1c;
}

.message-info {
  background-color: #dbeafe;
  color: #1e40af;
}
</style>