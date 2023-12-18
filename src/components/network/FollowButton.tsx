// FollowButton.tsx
import { api } from '~/utils/api';
import { useState } from 'react';

interface FollowButtonProps {
  userId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const toggleFollow = api.follow.toggleFollow.useMutation();

  const handleFollowClick = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await toggleFollow.mutate({ userId });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const buttonClassName = isFollowing ? 'bg-blue-500' : 'bg-green-500';

  return (
    <button
      className={`${buttonClassName} text-white px-4 py-2 rounded`}
      onClick={handleFollowClick}
    >
      {isFollowing ? 'Following' : 'Follow'}
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

