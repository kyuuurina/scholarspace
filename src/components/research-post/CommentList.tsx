// hooks
import React, { useState } from "react";
import { useRouter } from "next/router";

// form validation
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// utils
import { api } from "~/utils/api";

// components
import NewComment from "./PostComment";
import PrimaryButton from "../button/PrimaryButton";
import FormErrorMessage from "~/components/FormErrorMessage";

type CommentsSectionProps = {
  post_id: string;
  refetch: () => void;
};

const CommentsList: React.FC<CommentsSectionProps> = ({
  post_id,
  refetch,
}) => {
  // form schema
  const schema: ZodType<{ commentN: string }> = z.object({
    commentN: z.string().min(3, { message: "Task description is too short" }),
  });

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<{ commentN: string }>({
    resolver: zodResolver(schema),
  });

  // Fetch task comments
  const commentsQuery = api.postcomment.list.useQuery(
    { post_id: post_id },
    { enabled: !!post_id }
  );
  const comments = commentsQuery.data || [];

  // Create a new comment
  const addComment = api.postcomment.create.useMutation();

  const handleCommentSubmit = async (formData: { commentN: string }) => {
    try {
      // Create the comment
      await addComment.mutateAsync({
        post_id,
        value: formData.commentN,
      });

      // Clear the input field
      reset();
      refetch();
      await commentsQuery.refetch();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 lg:py-16">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white lg:text-2xl">
            Discussion ({comments.length})
          </h2>
        </div>
        <div className="flex flex-col justify-between">
          {/* Comment Input */}
            <textarea
                id ="postcommentvalue"
                className="border border-gray-300 dark:border-gray-700 rounded-md p-2 mb-2"
                placeholder="Add a comment..."
                {...register("commentN")}
            />
          {/* <TextEditor
            documentValue={""}
            setDocumentValue={(value) => setValue("commentN", value)}
          /> */}
          {errors.commentN && (
            <FormErrorMessage text={errors.commentN.message} />
          )}
          <form
            onSubmit={handleSubmit(handleCommentSubmit)}
            className="mb-3 justify-between"
          >
            {/* Post Comment Button */}
            <PrimaryButton name="Post comment" type="submit" />
          </form>
        </div>
        {/* Display Comments */}
        {comments.map((comment) => (
          <NewComment key={comment.comment_id} comment={comment} />
        ))}
      </div>
    </section>
  );
};

export default CommentsList;