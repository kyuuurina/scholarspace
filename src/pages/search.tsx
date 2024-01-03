// search.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SearchPost from '~/components/research-post/SearchPost';
import { api } from '~/utils/api';
import { useFetchSearchResults } from '~/utils/researchpost';

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

const SearchPage: React.FC = () => {
  const router = useRouter();
  const query = router.query.query as string;
  
  // Call the hook directly within the component body
  const { searchPostResults, isLoading, error } = useFetchSearchResults(query);

  useEffect(() => {
    // Fetch search results when the query changes
    // Avoid calling useFetchSearchResults here
  }, [query]);

  return (
    <div className="w-full max-w-screen-xl p-8">
      <h1 className="text-2xl font-bold mb-4">Search Results for {query}</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error fetching search results</p>}
      {searchPostResults.map((post) => (
        <SearchPost key={post.post_id} post={post} />
      ))}
    </div>
  );
};

export default SearchPage;
