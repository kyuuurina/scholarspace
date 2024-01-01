import { api } from "./api";

export const useFetchUsers = () => {
  const usersQuery = api.user.listUsers.useQuery();

  const { isLoading, error } = usersQuery;

  // store members in an array
  const users: {
    userId: string;
    userName: string | null;
    userEmail: string | null;
    userAvatarUrl: string | null; // Make it nullable to handle potential null values
  }[] = [];

  if (usersQuery.data) {
    usersQuery.data.forEach((user) => {
      users.push({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userAvatarUrl: user.avatar_url,
      });
    });
  }

  return {
    users,
    error,
    isLoading,
  };
};