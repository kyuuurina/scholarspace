import { api } from './api';

// Fetch comments based on post_id
export const fetchComments = (post_id: string) => {
  const comments = api.postcomment.list.useQuery(
    {
      post_id: post_id,
    },
    {
      enabled: !!post_id,
    }
  );

  const { data, isLoading, error } = comments;

  return {
    comments: data || [],
    isLoading,
    error,
  };
};