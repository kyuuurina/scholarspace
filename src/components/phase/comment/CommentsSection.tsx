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
import Comment from "./Comment";
import PrimaryButton from "../../button/PrimaryButton";
import TextEditor from "../TextEditor";
import FormErrorMessage from "~/components/FormErrorMessage";

type CommentsSectionProps = {
  task_id: string;
  refetch: () => void;
};

const CommentsSection: React.FC<CommentsSectionProps> = ({
  task_id,
  refetch,
}) => {
  // form schema
  const schema: ZodType<{ commentN: string }> = z.object({
    commentN: z.string().min(10, { message: "Comment is too short" }),
  });

  // react-hook-form
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<{ commentN: string }>({
    resolver: zodResolver(schema),
  });

  // Fetch task comments
  const commentsQuery = api.comment.list.useQuery(
    { task_id: task_id },
    { enabled: !!task_id }
  );
  const comments = commentsQuery.data || [];

  const sortedComments = comments.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Create a new comment
  const addComment = api.comment.create.useMutation();

  const handleCommentSubmit = async (formData: { commentN: string }) => {
    try {
      // Create the comment
      await addComment.mutateAsync({
        task_id,
        value: formData.commentN,
      });
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
          <TextEditor
            documentValue={""}
            setDocumentValue={(value) => setValue("commentN", value)}
          />
          <div className="flex justify-between">
            <div>
              {errors.commentN && (
                <FormErrorMessage text={errors.commentN.message} />
              )}
            </div>
            <form
              onSubmit={handleSubmit(handleCommentSubmit)}
              className="mb-3 justify-between"
            >
              {/* Post Comment Button */}
              <PrimaryButton name="Post comment" type="submit" />
            </form>
          </div>
        </div>
        {/* Display Comments */}
        {sortedComments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            refetch={async () => {
              await commentsQuery.refetch();
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default CommentsSection;
