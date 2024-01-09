import { useState } from "react";
import { useForm } from "react-hook-form";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { api } from "~/utils/api";
import { TRPCClientError } from "@trpc/client";

// local components
import FormErrorMessage from "~/components/FormErrorMessage";
import Modal from "~/components/modal/Modal";
import PrimaryButton from "~/components/button/PrimaryButton";
import { useRouterId } from "~/utils/routerId";
import toast from "react-hot-toast";
import ErrorToast from "~/components/toast/ErrorToast";

// types
type ModalProps = {
  openModal: boolean;
  onClick: () => void;
  refetch: () => Promise<void>;
};

type GrantFormData = {
  name: string;
  start_at: Date;
  end_at: Date | null;
};

const CreateGrantModal: React.FC<ModalProps> = ({
  openModal,
  onClick,
  refetch,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const id = useRouterId();

  // schema for form validation
  const schema: ZodType<GrantFormData> = z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long.")
      .max(100, "Name must be at most 100 characters long."),
    start_at: z.date(),
    end_at: z.date().nullable(),
  });

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GrantFormData>({
    resolver: zodResolver(schema),
  });

  // create grant
  const createGrant = api.grant.create.useMutation();

  // submit handler
  const onSubmit = async (formData: GrantFormData) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await createGrant.mutateAsync({
        ...formData,
        workspace_id: id,
      });
      onClick();
      reset();
      await refetch();
      setIsSubmitting(false);
    } catch (error) {
      toast.custom(() => {
        setIsSubmitting(false);
        if (error instanceof TRPCClientError) {
          return <ErrorToast message={error.message} />;
        } else {
          // Handle other types of errors or fallback to a default message
          return <ErrorToast message="An error occurred." />;
        }
      });
    }
  };

  return (
    <div>
      <Modal
        show={openModal}
        onClose={() => {
          onClick();
          reset();
        }}
        title="Add Grant"
      >
        <form
          autoComplete="off"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Grant Name
            </label>
            <input
              id="name"
              className="block w-full"
              {...register("name", { required: true })}
            />
            {errors.name && <FormErrorMessage text={errors.name.message} />}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Start At
            </label>
            <input
              id="start_at"
              type="date"
              className="block w-full"
              {...register("start_at", { required: true, valueAsDate: true })}
            />
            {errors.start_at && (
              <FormErrorMessage text={errors.start_at.message} />
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              End At
            </label>
            <input
              id="end_at"
              type="date"
              className="block w-full"
              {...register("end_at", { required: false, valueAsDate: true })}
            />
            {errors.end_at && <FormErrorMessage text={errors.end_at.message} />}
          </div>

          <PrimaryButton name="Create Grant" type="submit" />
        </form>
      </Modal>
    </div>
  );
};

export default CreateGrantModal;
