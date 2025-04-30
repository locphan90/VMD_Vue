// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@fortawesome/fontawesome-free/css/all.css';
import { createHead } from '@vueuse/head';

const app = createApp(App); // 👉 Tạo app trước
const head = createHead();  // 👉 Tạo head

app.use(router);
app.use(head);
app.mount('#app');
