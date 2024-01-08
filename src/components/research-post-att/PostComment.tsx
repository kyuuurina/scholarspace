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
  onCommentSubmit: (commentText: string) => Promise<void>;
}

type FormValues = { value: string }; // Define FormValues type

const PostComment: React.FC<PostCommentProps> = ({ post_id, onCommentSubmit }) => {
  // Zod schema for form validation
  const schema: ZodType<FormValues> = z.object({
    value: z.string().min(10, { message: 'Comment is too short' }),
  });

  // React-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // Handle submit for creating a comment
  const handleCommentSubmit = async (formData: FormValues) => {
    try {
      await onCommentSubmit(formData.value); // Pass only the comment text
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const createComment = api.postcomment.create.useMutation(); // Create useMutation here

  return (
    <div className="mb-1 border-t border-gray-200 bg-white p-4 text-base dark:border-gray-700 dark:bg-gray-900">
      {/* Form for creating a new comment */}
      <form className="flex items-center" onSubmit={handleSubmit(handleCommentSubmit)}>
        <div className="flex items-center w-full border rounded overflow-hidden">
          {/* <Avatar name="User" shape="circle" size="8" className="mr-2" /> */}
          <textarea
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


// import React from 'react';
// import { api } from '~/utils/api';
// import Avatar from '../avatar/avatar';
// import { FiTrash2 } from 'react-icons/fi';
// import { useForm } from 'react-hook-form';
// import FormErrorMessage from '~/components/FormErrorMessage';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

// interface PostCommentProps {
//   comment: {
//     comment_id: string;
//     value: string;
//     user: {
//       profile: {
//         name: string;
//         avatar_url: string | null;
//       };
//     };
//     // Add additional comment details as needed
//   };
//   onDelete: (commentId: string) => Promise<void>;
// }

// // Zod schema for form validation
// const schema = z.object({
//   value: z.string().min(10, { message: 'Comment is too short' }),
// });

// type FormValues = z.infer<typeof schema>;

// const PostComment: React.FC<PostCommentProps> = ({ comment, onDelete }) => {
//   const { comment_id, value, user } = comment;

//   // React-hook-form setup
//   const { handleSubmit, register, formState: { errors } } = useForm<FormValues>({
//     resolver: zodResolver(schema),
//   });

//   // Handle delete comment
//   const handleDelete = async () => {
//     try {
//       await onDelete(comment_id);
//     } catch (error) {
//       console.error('Error deleting comment:', error);
//     }
//   };

//   return (
//     <article className="mb-1 border-t border-gray-200 bg-white p-4 text-base dark:border-gray-700 dark:bg-gray-900">
//       <footer className="mb-1 flex items-center justify-between">
//         <div className="flex items-center">
//           <p className="mr-3 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
//             {user.profile.avatar_url && <Avatar avatar_url={user.profile.avatar_url} />}
//             <span className="ml-2">{user.profile.name}</span>
//           </p>
//         </div>
//         <div className="flex items-center space-x-4">
//           <button onClick={handleDelete} className="text-sm font-medium text-gray-500 hover:underline dark:text-gray-400">
//             <FiTrash2 size={18} className="inline-block" />
//             Delete
//           </button>
//         </div>
//       </footer>

//       {/* Form for updating comment value */}
//       <form onSubmit={handleSubmit((formData) => console.log(formData))}>
//         <textarea
//           {...register('value')}
//           defaultValue={value}
//           className="w-full p-2 border rounded"
//         />
//         <FormErrorMessage text={errors.value?.message} />
//         <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">
//           Update Comment
//         </button>
//       </form>
//     </article>
//   );
// };

// export default PostComment;
