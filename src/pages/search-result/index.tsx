// // pages/search-results/index.tsx
import { NextPageWithLayout } from "~/pages/_app";
import Layout from "~/components/layout/Layout";
import type { ReactElement } from "react";
import { useRouter } from "next/router";
import MiniUserCard from "~/components/profile/MiniUserCard";
import { searchProfiles } from "~/utils/searchService";
import { useEffect, useState } from "react";

const SearchResultsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { q } = router.query; // Get the search query from the URL

  type UserProfile = {
    profile_id: string;
    name: string;
    collab_status: string;
    avatar_url: string | null;
    about_me: string | null;
    research_interest: string | null;
    skills: string | null;
  };

  // State to store search results
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);

  // Effect to perform search when the component mounts or when the search query changes
  useEffect(() => {
    const performSearch = async () => {
      if (typeof q === 'string') { // Check if q is a string
        try {
          // Move the await call inside the async function
          const results = await searchProfiles(q.trim());
          setSearchResults(results as UserProfile[]);
        } catch (error) {
          console.error("Error during search:", error);
        }
      }
    };

    // Perform the search without using void to handle the promise explicitly
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    performSearch();
  }, [q]);

  return (
    <div className="mx-auto max-w-screen-xl p-8">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {searchResults.map((user) => (
            <MiniUserCard key={user.profile_id} otherUser={user} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          No matching profiles of &quot;{q}&quot;
        </p>
      )}
    </div>
  );
};

SearchResultsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default SearchResultsPage;

// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { NextPageWithLayout } from "~/pages/_app";
// import Layout from "~/components/layout/Layout";
// import { searchProfiles } from "~/utils/searchService";
// import MiniUserCard  from "~/components/profile/MiniUserCard";

// const SearchResultsPage: NextPageWithLayout = () => {
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [searchResults, setSearchResults] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const query = router.query.q as string;
//       if (query) {
//         setSearchQuery(query);
//         try {
//           const results = await performSearch(query);
//           setSearchResults(results);
//         } catch (error) {
//           console.error("Error during search:", error);
//           // Handle the error accordingly
//         }
//       }
//     };
  
//     fetchData();
//   }, [router.query.q]);

//   const performSearch = async (query: string): Promise<any[]> => {
//     try {
//       const results = await search(query);
//       return results;
//     } catch (error) {
//       console.error("Error during search:", error);
//       // Return an empty array or handle the error accordingly
//       return [];
//     }
//   };

//   return (
//     <div className="mx-auto max-w-screen-xl p-8">
//       <h1 className="mb-4 text-3xl font-bold">Search Results for {searchQuery}</h1>
//       {/* Display search results */}
//       {searchResults.map((result) => (
//         <MiniUserCard key={result.profile_id} otherUser={result} />
//       ))}
//     </div>
//   );
// };

// SearchResultsPage.getLayout = function getLayout(page: JSX.Element) {
//   return <Layout>{page}</Layout>;
// };

// export default SearchResultsPage;
