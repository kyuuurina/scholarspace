import { api } from "~/utils/api";
import { useUser } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

type ReactionButtonProps = {
  commentId: string;
};

const ReactionButton: React.FC<ReactionButtonProps> = ({ commentId }) => {
  const user = useUser();
  const [reactionToggled, setReactionToggled] = useState(false);

  const { data: reaction } = api.reaction.getByCommentAndUserId.useQuery({
    comment_id: commentId,
    user_id: user?.id || "",
  });

  const { data: reactions, refetch } = api.reaction.listbyCommentId.useQuery({
    comment_id: commentId,
  });

  const createReaction = api.reaction.create.useMutation();

  const handleCreateReaction = async () => {
    await createReaction.mutateAsync({
      comment_id: commentId,
    });
    setReactionToggled(true);
    await refetch();
  };

  const deleteReaction = api.reaction.delete.useMutation();

  const handleDeleteReaction = async () => {
    await deleteReaction.mutateAsync({
      comment_id: commentId,
      user_id: user?.id || "",
    });
    setReactionToggled(false);
    await refetch();
  };

  const handleToggleReaction = async () => {
    if (reactionToggled) {
      await handleDeleteReaction();
    } else {
      await handleCreateReaction();
    }
  };

  useEffect(() => {
    // Check if reaction exists when the component mounts
    if (reaction !== null) {
      setReactionToggled(true);
    }
  }, [reaction]);

  return (
    <button
      className={`first-letter: rounded-md border px-2 hover:bg-gray-200
      ${reactionToggled ? "border-purple-400 bg-gray-100" : "bg-white"}`}
      onClick={handleToggleReaction}
    >
      <span>👍</span>
      {reactions && reactions?.length > 0 && (
        <span className="ml-1">{reactions?.length}</span>
      )}
    </button>
  );
};

export default ReactionButton;
