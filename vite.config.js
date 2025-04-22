import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://api.vmdjsc.com",
        changeOrigin: true,
        secure: false, // bỏ nếu server có chứng chỉ SSL hợp lệ
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
