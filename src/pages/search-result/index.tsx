// pages/search-results/index.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NextPageWithLayout } from "~/pages/_app";
import Layout from "~/components/layout/Layout";
import { search } from "~/utils/searchService";
import MiniUserCard  from "~/components/profile/MiniUserCard";

const SearchResultsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = router.query.q as string;
      if (query) {
        setSearchQuery(query);
        try {
          const results = await performSearch(query);
          setSearchResults(results);
        } catch (error) {
          console.error("Error during search:", error);
          // Handle the error accordingly
        }
      }
    };
  
    fetchData();
  }, [router.query.q]);

  const performSearch = async (query: string): Promise<any[]> => {
    try {
      const results = await search(query);
      return results;
    } catch (error) {
      console.error("Error during search:", error);
      // Return an empty array or handle the error accordingly
      return [];
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl p-8">
      <h1 className="mb-4 text-3xl font-bold">Search Results for {searchQuery}</h1>
      {/* Display search results */}
      {searchResults.map((result) => (
        <MiniUserCard key={result.profile_id} otherUser={result} />
      ))}
    </div>
  );
};

SearchResultsPage.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};

export default SearchResultsPage;
