import Modal from "../modal/Modal";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PrimaryButton from "../button/PrimaryButton";
import FormErrorMessage from "../FormErrorMessage";
import InviteUserButton from "../button/InviteUserButton";
import { useEffect, useState } from "react";

type MemberModalProps = {
  openModal: boolean;
  onClose: () => void;
  onSubmit: (data: addMemberData) => void; // function to add member
  addMemberError: string | undefined; // error from server
};

type addMemberData = {
  email: string;
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
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<addMemberData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
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
  return (
    <Modal title="Add Member" show={openModal} onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="flex">
            <input
              id="email"
              className="block w-full rounded-sm"
              {...register("email", { required: true })}
            />
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
