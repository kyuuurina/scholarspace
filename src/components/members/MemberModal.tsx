import Modal from "../modal/Modal";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PrimaryButton from "../button/PrimaryButton";
import FormErrorMessage from "../FormErrorMessage";
import InviteUserButton from "../button/InviteUserButton";
import { useEffect, useState } from "react";
import Select from "~/components/Select";

type MemberModalProps = {
  openModal: boolean;
  onClose: () => void;
  onSubmit: (data: addMemberData) => void; // function to add member
  addMemberError: string | undefined; // error from server
};

type addMemberData = {
  email: string;
  role: string;
};

const MemberModal: React.FC<MemberModalProps> = ({
  openModal,
  onClose,
  onSubmit,
  addMemberError,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined | null>(
    null
  );
  // form validation
  const schema: ZodType<addMemberData> = z.object({
    email: z
      .string()
      .min(2, "Email must be at least 2 characters long.")
      .email("Please enter a valid email."),
    role: z.string(),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    setValue,
  } = useForm<addMemberData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", role: "Researcher" }, // Include role with a default value
  });

  const emailValue = watch("email");
  const resetForm = () => {
    setErrorMessage(null);
  };

  useEffect(() => {
    if (addMemberError) {
      setErrorMessage(addMemberError);
    }
  }, [addMemberError]);

  useEffect(() => {
    if (errors?.email?.message) {
      setErrorMessage(errors.email.message);
    }
  }, [errors]);

  const handleRoleChange = (selectedRole: string) => {
    // Use setValue to update the 'role' field in the form
    setValue("role", selectedRole);
  };

  return (
    <Modal title="Add Member" show={openModal} onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="flex">
            <div className="flex">
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="block w-full rounded-sm"
                  {...register("email", { required: true })}
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="role">Role</label>
                <Select
                  initialValue={"Researcher"}
                  options={["Researcher", "Researcher Admin", "Student"]}
                  onValueChange={handleRoleChange}
                />
              </div>
            </div>
            {errorMessage === "User with this email does not exist." ? (
              <>
                <InviteUserButton email={emailValue} onSuccess={resetForm} />
              </>
            ) : null}
          </div>
          {errorMessage && (
            <>
              <FormErrorMessage text={errorMessage} />
            </>
          )}
        </div>
        {isDirty ? (
          <PrimaryButton type="submit" name="Add Member" />
        ) : (
          <PrimaryButton type="submit" name="Add Member" disabled />
        )}
      </form>
    </Modal>
  );
};

export default MemberModal;
