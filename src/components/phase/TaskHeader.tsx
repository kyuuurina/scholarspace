import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { api } from "~/utils/api";
import { FiX } from "react-icons/fi";

import FormErrorMessage from "~/components/FormErrorMessage";

type TaskHeaderProps = {
  id: string | undefined;
  name: string | undefined;
  refetch: () => void;
  onClose: () => void;
};

const TaskHeader: React.FC<TaskHeaderProps> = ({
  id,
  name,
  refetch,
  onClose,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const ref = useClickAway(() => {
    setIsEditMode(false);
  });

  // form schema
  const schema: ZodType<{ name: string }> = z.object({
    name: z.string().min(3, { message: "Task name is too short" }),
  });

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>({
    resolver: zodResolver(schema),
    defaultValues: {
      name,
    },
  });

  // set default value for name
  useEffect(() => {
    if (name !== undefined) {
      setValue("name", name || "");
    }
  }, [name, setValue]);

  // update task name
  const updateName = api.task.updateTaskName.useMutation();

  const handleUpdateWorkspace = async (formData: { name: string }) => {
    if (id) {
      try {
        await updateName.mutateAsync({
          id: id,
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
    <div className="flex justify-between border-b border-gray-300 pb-5">
      {isEditMode ? (
        // Edit mode: Render input field
        <form
          onSubmit={handleSubmit(handleUpdateWorkspace)}
          autoComplete="off"
          ref={ref as React.MutableRefObject<HTMLFormElement>}
        >
          <input
            {...register("name")}
            autoFocus
            className="editable-input text-2xl font-bold"
            autoComplete="off"
          />
          {errors.name && <FormErrorMessage text={errors.name.message} />}
        </form>
      ) : (
        // View mode: Render text
        <h1
          className="cursor-pointer bg-purple-200 text-2xl font-bold"
          onClick={() => setIsEditMode(true)}
        >
          {name}
        </h1>
      )}
      <button onClick={onClose} className="fa-icons rounded-sm p-2">
        <FiX className="h-4 w-4" />
      </button>
    </div>
  );
};

export default TaskHeader;
