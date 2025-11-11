// Đăng bài tin tức kinh tế
export async function postNews({
  title,
  summary,
  content,
  tags,
  isPublished,
  images,
}: {
  title: string;
  summary: string;
  content: string;
  tags?: string[];
  isPublished?: boolean;
  images?: File[];
}) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("summary", summary);
  formData.append("content", content);
  if (tags) tags.forEach((tag) => formData.append("tags", tag));
  if (typeof isPublished === "boolean")
    formData.append("isPublished", String(isPublished));
  if (images) images.forEach((img) => formData.append("images", img));

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
    },
    body: formData,
  });
  if (!response.ok) throw new Error("Đăng bài thất bại");
  return await response.json();
}
import axiosInstance from "@/lib/axios";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  category: string;
  tags: string[];
  readTime: number;
  views: number;
}

export interface ArticleListResponse {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ArticleFilters {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  search?: string;
  sortBy?: "latest" | "popular" | "trending";
}

// Service xử lý articles
export const articleService = {
  // Lấy danh sách articles
  async getArticles(filters?: ArticleFilters): Promise<ArticleListResponse> {
    const response = await axiosInstance.get<ArticleListResponse>("/articles", {
      params: filters,
    });
    return response.data;
  },

  // Lấy chi tiết article
  async getArticleById(id: string): Promise<Article> {
    const response = await axiosInstance.get<Article>(`/articles/${id}`);
    return response.data;
  },

  // Lấy articles phổ biến
  async getPopularArticles(limit = 6): Promise<Article[]> {
    const response = await axiosInstance.get<Article[]>("/articles/popular", {
      params: { limit },
    });
    return response.data;
  },

  // Lấy articles featured
  async getFeaturedArticles(): Promise<Article[]> {
    const response = await axiosInstance.get<Article[]>("/articles/featured");
    return response.data;
  },

  // Tìm kiếm articles
  async searchArticles(query: string): Promise<Article[]> {
    const response = await axiosInstance.get<Article[]>("/articles/search", {
      params: { q: query },
    });
    return response.data;
  },

  // Lấy articles theo category
  async getArticlesByCategory(
    category: string,
    page = 1,
    pageSize = 10
  ): Promise<ArticleListResponse> {
    const response = await axiosInstance.get<ArticleListResponse>(
      `/articles/category/${category}`,
      {
        params: { page, pageSize },
      }
    );
    return response.data;
  },

  // Lấy articles liên quan
  async getRelatedArticles(articleId: string, limit = 3): Promise<Article[]> {
    const response = await axiosInstance.get<Article[]>(
      `/articles/${articleId}/related`,
      {
        params: { limit },
      }
    );
    return response.data;
  },
};
