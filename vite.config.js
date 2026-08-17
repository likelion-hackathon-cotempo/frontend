import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://api.cotempo.store",
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.removeHeader("origin"); // ← Origin 헤더 제거 (CORS 우회)
          });
        },
      },
    },
  },
});