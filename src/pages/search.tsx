//auth
import { useSession, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

// search.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SearchPost from '~/components/research-post/SearchPost';
import { api } from '~/utils/api';
import { useFetchSearchResults } from '~/utils/researchpost';
import BackButton from '~/components/search/BackButton';

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

const SearchPage: NextPageWithLayout = () => {
  const supabase = useSupabaseClient();
  const session = useSession();
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
      <BackButton> Go Back</BackButton>
      <div className="mb-4"></div>
      <h1 className="text-2xl font-bold mb-4">Search Results for &quot;{query}&quot;</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error fetching search results</p>}

      {searchPostResults.length === 0 && !isLoading && !error && (
        <p>No matching results found.</p>
      )}

        {searchPostResults.map((post, index) => (
        <div key={post.post_id} className={`mb-12 ${index !== searchPostResults.length - 1 ? 'mb-12' : ''}`}>
          <SearchPost post={post} />
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
