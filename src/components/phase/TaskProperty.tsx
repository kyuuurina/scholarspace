import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { api } from "~/utils/api";

import FormErrorMessage from "~/components/FormErrorMessage";

type TaskPropertyProps = {
  task_id: string | undefined;
  property_id: string | undefined;
  value: string | undefined | null;
  refetch: () => void;
  label: string;
};

const TaskProperty: React.FC<TaskPropertyProps> = ({
  task_id,
  property_id,
  value,
  refetch,
  label,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const ref = useClickAway(() => {
    setIsEditMode(false);
  });

  // form schema
  const schema: ZodType<{ value: string }> = z.object({
    value: z.string().min(3, { message: "Value is too short" }),
  });

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<{ value: string | null }>({
    resolver: zodResolver(schema),
    defaultValues: {
      value,
    },
  });

  // set default value for name
  useEffect(() => {
    if (value !== undefined) {
      setValue("value", value || "");
    }
  }, [value, setValue]);

  // update property value
  const updatePropertyValue = api.task.updateProperty.useMutation();

  const handleUpdatePropety = async (formData: { value: string | null }) => {
    if (task_id && property_id) {
      try {
        await updatePropertyValue.mutateAsync({
          task_id,
          property_id,
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
    <div className="mb-3 flex flex-col">
      {/* add label */}
      <label className="text-sm font-medium text-gray-700 p-1">{label}</label>
      {isEditMode ? (
        // Edit mode: Render input field
        <form
          onSubmit={handleSubmit(handleUpdatePropety)}
          autoComplete="off"
          ref={ref as React.MutableRefObject<HTMLFormElement>}
        >
          <input
            {...register("value")}
            autoFocus
            className="w-56"
            autoComplete="off"
          />
          {errors.value && <FormErrorMessage text={errors.value.message} />}
        </form>
      ) : (
        // View mode: Render text
        <input
          className="w-56 cursor-pointer"
          readOnly
          onClick={() => setIsEditMode(true)}
          value={value || ""}
        ></input>
      )}
    </div>
  );
};

export default TaskProperty;
