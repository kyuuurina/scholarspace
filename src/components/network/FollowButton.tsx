import { api } from '~/utils/api';
import { useState, useEffect } from 'react';
import { useFetchFollowStatus } from '~/utils/follow';
import { useRouter } from 'next/router';

interface FollowButtonProps {
  userId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId }) => {
  const { mutate: toggleFollowMutation } = api.follow.toggleFollow.useMutation();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const router = useRouter();

  // Fetch follow status when the component mounts or when userId changes
  const { isFollowing: initialIsFollowing, isLoading, error } = useFetchFollowStatus(userId);

  // Update state based on the initial follow status
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollowClick = async () => {
    try {
      // Use toggleFollowMutation without await
      toggleFollowMutation({ userId });
  
      // Wait for the mutation to complete before refetching the follow status
      await new Promise((resolve) => setTimeout(resolve, 0));

      router.reload();
  
      // Refetch the follow status when userId changes
      const updatedStatus = api.follow.getFollowStatus.useQuery({ userId });
  
      // Ensure the query has been executed successfully before accessing the data
      if (updatedStatus.isSuccess && updatedStatus.data) {
        setIsFollowing(updatedStatus.data.isFollowing);
      } else {
        console.error('Error fetching follow status:', updatedStatus.error);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const buttonClassName = isFollowing ? 'bg-blue-500' : 'bg-green-500';

  return (
    <button
      className={`${buttonClassName} text-white px-4 py-2 rounded`}
      onClick={handleFollowClick}
      disabled={isLoading} // Disable the button while loading
    >
      {isLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;

// import { api } from '~/utils/api';
// import { useState } from 'react';

// interface FollowButtonProps {
//   userId: string;
// }

// const FollowButton: React.FC<FollowButtonProps> = ({ userId }) => {
//   const [isFollowing, setIsFollowing] = useState(false);
//   const toggleFollow = api.follow.toggleFollow.useMutation();

//   const handleFollowClick = async () => {
//     try {
//       // eslint-disable-next-line @typescript-eslint/await-thenable
//       await toggleFollow.mutate({ userId });
//       setIsFollowing(!isFollowing);
//     } catch (error) {
//       console.error('Error toggling follow:', error);
//     }
//   };

//   return (
//     <button
//       className={`${
//         isFollowing ? "bg-blue-500" : "bg-green-500"
//       } text-white px-4 py-2 rounded`}
//       onClick={handleFollowClick}
//     >
//       {isFollowing ? "Following" : "Follow"}
//     </button>
//   );
// };

// export default FollowButton;




// // components/FollowButton.tsx
// import { useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
// // import { useFetchFollow, useFollowUser, useUnfollowUser } from ''
// // import { useFetchFollow, useFollowUser, useUnfollowUser } from '~/utils/follow';

// interface FollowButtonProps {
//   targetUserId: string;
//   isFollowing: boolean;
// }

