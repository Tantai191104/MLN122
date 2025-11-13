export interface ArticleUser {
  _id: string
  name?: string
  email?: string
  avatar?: string
}

export interface Post {
  _id: string
  title: string
  summary: string
  content: string
  images?: string[]
  tags?: string[]
  createdAt?: string
  publishedAt?: string
  readTime?: string
  userId?: ArticleUser
}
