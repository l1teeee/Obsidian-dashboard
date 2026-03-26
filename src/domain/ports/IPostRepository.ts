import type { PostSummary, PostRecord, UpcomingPost } from '../entities/Post';

export interface IPostRepository {
  getRecentPosts(): PostSummary[];
  getUpcoming():    UpcomingPost[];
  getById(id: string): PostRecord | null;
}
