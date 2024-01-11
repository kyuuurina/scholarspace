import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

import TextEditor from "./TextEditor";
import FormErrorMessage from "~/components/FormErrorMessage";

type TaskDescriptionProps = {
  id: string | undefined;
  description: string | undefined | null;
  refetch: () => void;
};

const TaskDescription: React.FC<TaskDescriptionProps> = ({
  id,
  description,
  refetch,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  // form schema
  const schema: ZodType<{ description: string }> = z.object({
    description: z
      .string()
      .min(3, { message: "Task description is too short" }),
  });

  // react-hook-form
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<{ description: string }>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: description ?? "",
    },
  });

  // set default value for description
  useEffect(() => {
    if (description !== undefined) {
      setValue("description", description || "");
    }
  }, [description, setValue]);

  // update task description
  const updateDescription = api.task.updateDescription.useMutation();

  const handleUpdateDescription = async (formData: { description: string }) => {
    if (id) {
      try {
        await updateDescription.mutateAsync({
          id,
          ...formData,
        });
      } finally {
        refetch();
        reset();
        setIsEditMode(false);
      }
    }
  };

  return (
    <div className="flex w-full flex-col border-b border-gray-300 pb-5">
      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
        Description
      </label>
      {isEditMode ? (
        <div>
          <TextEditor
            documentValue={description || ""}
            setDocumentValue={(value) => setValue("description", value)}
          />
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await handleSubmit(handleUpdateDescription)(e);
            }}
            autoComplete="off"
          >
            {errors.description && (
              <FormErrorMessage text={errors.description.message} />
            )}
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                className="btn btn-outline mr-2"
                onClick={() => {
                  reset();
                  setIsEditMode(false);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div
          className="cursor-pointer"
          onClick={() => setIsEditMode(true)}
          dangerouslySetInnerHTML={{
            __html: description || "Add a detailed description here....",
          }}
        ></div>
      )}
    </div>
  );
};

export default TaskDescription;
