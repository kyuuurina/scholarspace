import { useState } from "react";
import { useForm } from "react-hook-form";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  project_id?: string[];
};

const CreateGrantModal: React.FC<ModalProps> = ({
  openModal,
  onClick,
  refetch,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedProjects: string[] = [];
  const id = useRouterId();

  // schema for form validation
  const schema: ZodType<GrantFormData> = z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long.")
      .max(100, "Name must be at most 100 characters long."),
    start_at: z.date(),
    end_at: z.date().nullable(),
    project_id: z.array(z.string()).optional(),
  });

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<GrantFormData>({
    resolver: zodResolver(schema),
  });

  // handle when a project is selected
  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // if selected exists in array, remove it, else push to selectedProjects array
    if (selectedProjects.includes(e.target.value)) {
      const index = selectedProjects.indexOf(e.target.value);
      if (index > -1) {
        selectedProjects.splice(index, 1);
      }
    } else {
      selectedProjects.push(e.target.value);
    }
    setValue("project_id", selectedProjects);
    console.log(getValues("project_id"));
  };

  // get projects of workspace
  const projects = api.project.listWorkspaceProjects.useQuery({
    workspace_id: id,
  });

  // create grant
  const createGrant = api.grant.create.useMutation();

  // submit handler
  const onSubmit = async (formData: GrantFormData) => {
    if (isSubmitting) return;
    setValue("project_id", selectedProjects);
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

          {/* display projects in list */}
          <div>
            <label
              htmlFor="project_id"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Projects
            </label>
            <select
              id="project_id"
              className="block w-full"
              onChange={(e) => {
                handleProjectSelect(e);
              }}
            >
              {projects.data?.map((project) => (
                <option key={project.project_id} value={project.project_id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.project_id && (
              <FormErrorMessage text={errors.project_id.message} />
            )}
          </div>

          <PrimaryButton name="Create Grant" type="submit" />
        </form>
      </Modal>
    </div>
  );
};

export default CreateGrantModal;
