import React from 'react';
import { api } from '~/utils/api';
import Avatar from '../avatar/avatar';
import { useForm } from 'react-hook-form';
import FormErrorMessage from '~/components/FormErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';

//button
import PrimaryButton from '../button/PrimaryButton';
import { FiSend } from 'react-icons/fi';

interface PostCommentProps {
  post_id: string;
  onCommentSubmit: (formData: FormValues) => void; 
  refetch: () => void;
}

export type FormValues = { value: string }; // Define FormValues type

const PostComment: React.FC<PostCommentProps> = ({ post_id, refetch }) => {
  // Zod schema for form validation
  const schema: ZodType<FormValues> = z.object({
    value: z.string().min(3, { message: 'Comment is too short' }),
  });

  // React-hook-form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // Fetch post comments
  const commentsQuery = api.postcomment.list.useQuery(
    { post_id: post_id },
    { enabled: !!post_id }
  );

    const comments = commentsQuery.data || [];

  // Create a new comment
  const addComment = api.postcomment.create.useMutation();

  const handleCommentSubmit = async (formData: FormValues) => {
    try {
      // Create the comment
      await addComment.mutateAsync({
        post_id,
        value: formData.value,
      });
      reset();
      refetch();
      await commentsQuery.refetch();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="mb-1 border-t border-gray-200 bg-white p-4 text-base dark:border-gray-700 dark:bg-gray-900">
      {/* Form for creating a new comment */}
      <form className="flex items-center" onSubmit={handleSubmit(handleCommentSubmit)}>
        <div className="flex items-center w-full border rounded overflow-hidden">
          {/* <Avatar name="User" shape="circle" size="8" className="mr-2" /> */}
          <input
            {...register('value')}
            placeholder="Add a comment..."
            className="w-full p-2 border-none bg-transparent focus:outline-none focus:border-none"
            style={{ minWidth: 0, flex: 1, verticalAlign: 'middle' }}
          />
        </div>
        <div className="ml-2">
          <PrimaryButton
            type="submit"
            name='Comment'
            disabled={false} // Set the appropriate condition for disabling
          />
        </div>
      </form>
    </div>
  );
};

export default PostComment;