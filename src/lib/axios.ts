import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

// Tạo instance axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Thêm token vào mỗi request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("access_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request để debug (có thể tắt trong production)
    console.log("📤 Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
    });

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Xử lý response và errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response để debug
    console.log("📥 Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Xử lý các loại lỗi khác nhau
    if (error.response) {
      const { status, data } = error.response;

      console.error("❌ Response Error:", {
        status,
        url: error.config?.url,
        data,
      });

      // 401 - Unauthorized: Token hết hạn hoặc không hợp lệ
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Thử refresh token
          const refreshToken = localStorage.getItem("refresh_token");

          if (refreshToken) {
            const response = await axios.post(
              `${axiosInstance.defaults.baseURL}/auth/refresh`,
              { refresh_token: refreshToken }
            );

            const { access_token } = response.data;

            // Lưu token mới
            localStorage.setItem("access_token", access_token);

            // Retry request với token mới
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
            }
            return axiosInstance(originalRequest);
          } else {
            // Không có refresh_token => buộc đăng xuất
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return Promise.reject(error);
          }
        } catch (refreshError) {
          // Refresh token thất bại, đăng xuất user
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");

          // Redirect về trang login
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      // 403 - Forbidden: Không có quyền truy cập
      if (status === 403) {
        console.error(
          "🚫 Forbidden: Bạn không có quyền truy cập tài nguyên này"
        );
      }

      // 404 - Not Found
      if (status === 404) {
        console.error("🔍 Not Found: Không tìm thấy tài nguyên");
      }

      // 500 - Internal Server Error
      if (status === 500) {
        console.error("💥 Server Error: Lỗi máy chủ");
      }
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error("📡 Network Error: Không thể kết nối đến server");
    } else {
      // Lỗi khi setup request
      console.error("⚙️ Setup Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
