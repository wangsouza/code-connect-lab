import { apiClient } from './client'

export interface PostAuthor {
  id: string
  name: string
  username: string
}

export interface PostSummary {
  id: string
  slug: string
  title: string
  description: string
  thumbnailUrl: string | null
  tags: string[]
  author: PostAuthor
  likesCount: number
  commentsCount: number
  likedByMe: boolean
  createdAt: string
}

export interface Comment {
  id: string
  content: string
  author: PostAuthor
  replies: Comment[]
  createdAt: string
}

export interface PostDetail extends PostSummary {
  content: string
  comments: Comment[]
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedPosts {
  data: PostSummary[]
  meta: PaginationMeta
}

export interface GetPostsParams {
  search?: string
  page?: number
}

export async function getPosts(
  params: GetPostsParams = {},
): Promise<PaginatedPosts> {
  const { data } = await apiClient.get<PaginatedPosts>('/posts', { params })
  return data
}

export async function getPost(slug: string): Promise<PostDetail> {
  const { data } = await apiClient.get<PostDetail>(`/posts/${slug}`)
  return data
}

export async function likePost(id: string): Promise<void> {
  await apiClient.post(`/posts/${id}/likes`)
}

export async function unlikePost(id: string): Promise<void> {
  await apiClient.delete(`/posts/${id}/likes`)
}

export async function createComment(
  id: string,
  payload: { content: string; parentId?: string },
): Promise<Comment> {
  const { data } = await apiClient.post<Comment>(
    `/posts/${id}/comments`,
    payload,
  )
  return data
}
