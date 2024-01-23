import { api } from "./api";
import { useRouterId } from "./routerId";

// search post
export const useFetchSearchPostResults = (query: string) => {
    const searchPostResults = api.search.searchPost.useQuery(
      {
        query,
      },
      {
        enabled: !!query,
      }
    );
  
    const { data, isLoading, error } = searchPostResults;
  
    return {
      searchPostResults: data || [],
      isLoading,
      error,
    };
  };
  
  // search profile
  export const useFetchSearchProfileResults = (query: string) => {
    const searchProfileResults = api.search.searchProfile.useQuery(
      {
        query,
      },
      {
        enabled: !!query,
      }
    );
  
    const { data, isLoading, error } = searchProfileResults;
  
    return {
      searchProfileResults: data || [],
      isLoading,
      error,
    };
  };
  
  // combined search function
  export const useFetchCombinedSearchResults = (query: string) => {
    const searchPostResults = useFetchSearchPostResults(query);
    const searchProfileResults = useFetchSearchProfileResults(query);
  
    // Combine the results
    const combinedResults = [
      ...searchPostResults.searchPostResults.map(post => ({ type: 'post', data: post })),
      ...searchProfileResults.searchProfileResults.map(profile => ({ type: 'profile', data: profile })),
    ];
  
    return {
      combinedResults,
      isLoading: searchPostResults.isLoading || searchProfileResults.isLoading,
      error: searchPostResults.error || searchProfileResults.error,
    };
  };