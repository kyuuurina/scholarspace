//auth
import { useSession, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

// search.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SearchPost from '~/components/research-post/SearchPost';
import Post from '~/components/research-post/Post';
import MiniUserCard from "~/components/profile/MiniUserCard";
import { api } from '~/utils/api';
import { useFetchSearchResults } from '~/utils/researchpost';
import { useFetchCombinedSearchResults } from "~/utils/search";
import BackButton from '~/components/search/BackButton';
import { useQuery } from "@tanstack/react-query";

//layout
import Layout from "~/components/layout/Layout";
import type { NextPageWithLayout } from "~/pages/_app";
import Head from "~/components/layout/Head";
import type { ReactElement } from "react";

interface Post {
  post_id: string;
  user_id: string;
  category: string;
  title: string;
  document: string | null;
  author: string | null;
  description: string | null;
  created_at: Date;
}

interface OtherUser {
  profile_id: string;
  name: string;
  collab_status: string;
}

const SearchPage: NextPageWithLayout = () => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();
  const query = router.query.query as string;

  // Call the hook directly within the component body
  const { combinedResults, isLoading, error } = useFetchCombinedSearchResults(query);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // query key for refetch
  const postQueryKey = ['getPost', currentPostId]; // Assuming have a valid post ID
  const { data: updatedPostData, refetch: refetchPost } = useQuery(
    postQueryKey,
    { enabled: false } // Disable automatic fetching on mount
  );

  // Render EditPostForm component
  const handleEditClick = (postId: string) => {
    setEditModalOpen(true);
    setCurrentPostId(postId);
  };

  useEffect(() => {
    // Fetch search results when the query changes
    // Avoid calling useFetchSearchResults here
  }, [query]);
  

  return (
    <div className="w-full max-w-screen-xl p-8">
      <BackButton> Go Back</BackButton>
      <div className="mb-4"></div>
      <h1 className="text-2xl font-bold mb-4">Search Results for &quot;{query}&quot;</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error fetching search results</p>}

      {combinedResults.length === 0 && !isLoading && !error && (
        <p>No matching results found.</p>
      )}

{combinedResults.map((result, index) => (
        <div key={index} className={`mb-12 ${index !== combinedResults.length - 1 ? 'mb-12' : ''}`}>
          {result.type === 'post' && (
            <Post
              post={result.data as Post}
              onEditClick={() => handleEditClick((result.data as Post).post_id)}
              refetch={refetchPost}
            />
          )}
          {result.type === 'profile' && (
            <MiniUserCard otherUser={result.data as OtherUser} />
          )}
        </div>
      ))}
    </div>
  );
};

SearchPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head title="Search Results" />
      <Layout>{page}</Layout>
    </>
  );
};

export default SearchPage;
