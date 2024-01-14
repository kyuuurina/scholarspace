import { api } from "~/utils/api";
import { useUser } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

type LikeButtonProps = {
  postId: string;
};

const LikeButton: React.FC<LikeButtonProps> = ({ postId }) => {
    const user = useUser();
    const [likeToggled, setLikeToggled] = useState(false);
  
    const { data: likeCount, refetch: refetchLikeCount } = api.postlike.getPostLikeCount.useQuery({
      post_id: postId,
    });

    const toggleLike = api.postlike.toggleLike.useMutation({
      onSuccess: async () => {
        setLikeToggled(!likeToggled);
        await refetchLikeCount(); // Manually trigger a refetch of like count
      },
    });

    const handleToggleLike = async () => {
      await toggleLike.mutateAsync({
        post_id: postId,
      });
    };
  
    useEffect(() => {
      // Check if user has liked the post when the component mounts
      // Note: You might want to check if likeCount is not undefined or null
      if (likeCount && likeCount > 0) {
        setLikeToggled(true);
      }
    }, [likeCount]);
  
    return (
      <button
        className={`first-letter: rounded-md border px-2 hover:bg-gray-200
        ${likeToggled ? "border-purple-400 bg-gray-100" : "bg-white"}`}
        onClick={handleToggleLike}
      >
        <span>👍</span>
        {likeCount && likeCount > 0 && (
          <span className="ml-1">{likeCount}</span>
        )}
      </button>
    );
  };
  
  export default LikeButton;
