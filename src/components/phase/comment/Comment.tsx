import type { comment } from "@prisma/client";
import { api } from "~/utils/api";
import Avatar from "../../avatar/avatar";
import { FiMoreHorizontal } from "react-icons/fi";
import CommentActions from "./CommentActions";
import React, { useState, useEffect } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import TextEditor from "../TextEditor";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormErrorMessage from "~/components/FormErrorMessage";
import toast from "react-hot-toast";
import ErrorToast from "~/components/toast/ErrorToast";
import { TRPCClientError } from "@trpc/client";

type CommentProps = {
  comment: comment;
  refetch: () => Promise<void>;
};

const Comment: React.FC<CommentProps> = ({ comment, refetch }) => {
  const { user_id, created_at, id } = comment;
  const [showActions, setShowActions] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isReplyMode, setIsReplyMode] = useState(false);

  const editComment = api.comment.edit.useMutation();
  const createReplyComment = api.comment.createReply.useMutation();

  // form schema
  const schema: ZodType<{ value: string }> = z.object({
    value: z.string().min(10, { message: "Comment is too short" }),
  });

  // react-hook-form
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<{ value: string }>({
    resolver: zodResolver(schema),
    defaultValues: {
      value: comment.value ?? "",
    },
  });

  useEffect(() => {
    if (comment.value !== undefined) {
      setValue("value", comment.value || "");
    }
  }, [comment.value, setValue]);

  // get user from api
  const { data: user } = api.user.get.useQuery(
    { id: user_id },
    { enabled: !!user_id }
  );

  const handleUpdateComment = async (formData: { value: string }) => {
    // Send the edit request to the server
    try {
      await editComment.mutateAsync({
        id,
        ...formData,
      });
      reset();
      await refetch();
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateReplyComment = async (formData: { value: string }) => {
    // Send the reply request to the server
    try {
      await createReplyComment.mutateAsync({
        value: formData.value,
        task_id: comment.task_id,
        parent_id: comment.id,
      });
      reset();
      await refetch();
      setIsReplyMode(false);
    } catch (error) {
      toast.custom(() => {
        if (error instanceof TRPCClientError) {
          return <ErrorToast message={error.message} />;
        } else {
          // Handle other types of errors or fallback to a default message
          return (
            <ErrorToast message="Error to create reply. Please try again later." />
          );
        }
      });
    }
  };

  const ref = useClickAway(() => {
    setShowActions(false);
  });

  // delete comment
  const deleteComment = api.comment.delete.useMutation();
  const handleDeleteComment = async () => {
    try {
      await deleteComment.mutateAsync({ id });
      await refetch();
    } catch (error) {
      toast.custom(() => {
        if (error instanceof TRPCClientError) {
          return <ErrorToast message={error.message} />;
        } else {
          // Handle other types of errors or fallback to a default message
          return (
            <ErrorToast message="Error to delete comment. Please try again later." />
          );
        }
      });
    }
  };
  return (
    <div className="mb-1 border-t border-gray-200 bg-white p-4 text-base dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center">
          <p className="mr-3 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
            {user && <Avatar avatar_url={user.avatar_url} email={user.email} />}
            <span className="ml-2">{user?.name}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time
              dateTime={created_at.toLocaleString()}
              title={created_at.toLocaleString()}
            >
              {new Date(created_at).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </p>
        </div>
        <div className="relative">
          <div
            className="fa-icons cursor-pointer rounded-md p-2"
            onClick={() => setShowActions(true)}
          >
            <FiMoreHorizontal />
          </div>
          {showActions && (
            <div
              className="absolute left-0 top-full"
              ref={ref as React.MutableRefObject<HTMLDivElement>}
            >
              <CommentActions
                onEditClick={() => {
                  setIsEditMode(true);
                  setShowActions(false);
                }}
                onDeleteClick={async () => {
                  await handleDeleteComment();
                }}
              />
            </div>
          )}
        </div>
      </div>
      {isEditMode ? (
        <div>
          <TextEditor
            documentValue={comment.value}
            setDocumentValue={(value) => setValue("value", value)}
          />
          <div className="flex justify-between">
            <div>
              {errors.value && <FormErrorMessage text={errors.value.message} />}
            </div>
            <div className="flex justify-end">
              <button className="px-3" onClick={() => setIsEditMode(false)}>
                Cancel
              </button>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleSubmit(handleUpdateComment)(e);
                }}
                autoComplete="off"
              >
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : isReplyMode ? (
        <div>
          <TextEditor
            documentValue={comment.value}
            setDocumentValue={(value) => setValue("value", value)}
          />
          <div className="flex justify-between">
            <div>
              {errors.value && <FormErrorMessage text={errors.value.message} />}
            </div>
            <div className="flex justify-end">
              <button className="px-3" onClick={() => setIsReplyMode(false)}>
                Cancel
              </button>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleSubmit(handleCreateReplyComment)(e);
                }}
                autoComplete="off"
              >
                <button type="submit" className="btn btn-primary">
                  Reply
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: comment.value || "Add a comment here....",
            }}
          />
          <button onClick={() => setIsReplyMode(true)}>Reply</button>
        </div>
      )}
    </div>
  );
};

export default Comment;
