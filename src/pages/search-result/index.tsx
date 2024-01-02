/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// search/index.tsx
import React, { useEffect, useState } from 'react';
import SearchPost from '~/components/research-post/SearchPost';
import { useRouter } from 'next/router';

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

const SearchResultsPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Parse search results from the query string
    const results = router.query.results ? JSON.parse(router.query.results as string) : [];
    setSearchResults(results);
  }, [router.query.results, setSearchResults]);

  return (
    <div>
      <h1>Search Results</h1>
      {searchResults.map((post, index) => (
        <SearchPost key={index} post={post} />
      ))}
    </div>
  );
};

export default SearchResultsPage;
