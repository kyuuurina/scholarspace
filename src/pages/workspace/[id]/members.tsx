import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { FiUserPlus } from "react-icons/fi";

// local components
import Layout from "~/components/layout/Layout";
import Modal from "~/components/modal/Modal";
import Select from "~/components/Select";
import Header from "~/components/workspace/Header";
import PrimaryButton from "~/components/button/PrimaryButton";
import { SuccessToast } from "~/components/toast/SuccessToast";
import AvatarPlaceholder from "~/components/AvatarPlaceholder";
import { FormErrorMessage } from "~/components/FormErrorMessage";
import { ErrorToast } from "~/components/toast/ErrorToast";
import InviteUserButton from "~/components/button/InviteUserButton";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
type addMemberData = {
  email: string;
};

// utils
import { useFetchWorkspace, useFetchWorkspaceMembers } from "~/utils/workspace";
import { useFetchUsers } from "~/utils/user";
import { useRouterId } from "~/utils/routerId";

const Members: NextPageWithLayout = () => {
  const userId = getCookie("User ID");
  const router = useRouter();
  const workspaceId = useRouterId();
  const { name, imgUrl } = useFetchWorkspace();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>("");

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

  // members in the workspace
  const { workspaceMembers } = useFetchWorkspaceMembers();

  // search bar functions
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredMembers = workspaceMembers.filter((member) => {
    if (!member.memberEmail) {
      return; // Skip this member if it's null or undefined
    }

    let memberName = "";
    if (member.memberName) {
      memberName = member.memberName.toLowerCase();
    }

    const memberEmail = member.memberEmail.toLowerCase();
    const query = searchQuery.toLowerCase();
    return memberName.includes(query) || memberEmail.includes(query);
  });

  // users in the system
  const userArray: { label: string; value: string }[] = [];
  const { users } = useFetchUsers();

  if (users && workspaceMembers) {
    const workspaceMemberIds = workspaceMembers.map(
      (member) => member.memberId
    );

    users.forEach((user) => {
      const email = user.userEmail || "";
      const userId = user.userId;
      const isMember = workspaceMemberIds.includes(userId);

      // Check if the user is not a member of the workspace
      if (!isMember) {
        userArray.push({ label: email, value: userId });
      }
    });
  }

  // add member
  const addMember = api.workspace.addWorkspaceMember.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Member added" />);
      router.reload();
    },
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      await addMember.mutateAsync({
        workspaceId: workspaceId,
        email: data.email,
      });
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  // form error
  const resetForm = () => {
    setErrorMessage(null);
  };
  useEffect(() => {
    setErrorMessage(addMember.error?.message || "");
  }, [addMember.error]);

  // update member role
  const updateRole = api.workspace.updateRole.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Role updated" />);
    },
    onError: (error) => {
      toast.custom(() => <ErrorToast message={error.message} />);
    },
  });
  const handleRoleChange = (memberId: string, newRole: string) => {
    updateRole
      .mutateAsync({
        workspaceId: workspaceId,
        userId: memberId,
        role: newRole,
      })
      .then(() => {
        console.log("workspace updated");
      })
      .catch((error) => {
        console.error("Failed to update role:", error);
      });
  };

  // delete member
  const deleteMember = api.workspace.deleteWorkspaceMember.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Member deleted" />);
    },
  });

  const handleDeleteMember = (memberId: string) => {
    deleteMember
      .mutateAsync({
        workspaceId: workspaceId,
        userId: memberId,
      })
      .then(() => {
        router.reload();
      })
      .catch((error) => {
        console.error("Failed to delete member:", error);
      });
  };

  return (
    <>
      {/* add member modal */}
      <Modal
        title="Add Member"
        show={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex">
              <input
                id="email"
                className="block w-full rounded-sm"
                {...register("email", { required: true })}
              />
              {errorMessage ? (
                <>
                  <InviteUserButton email={emailValue} onSuccess={resetForm} />
                </>
              ) : null}
            </div>
            {errorMessage || errors ? (
              <>
                {errorMessage ? (
                  <FormErrorMessage text={errorMessage} />
                ) : (
                  <FormErrorMessage text={errors.email?.message} />
                )}
              </>
            ) : null}
          </div>
          {isDirty ? (
            <PrimaryButton type="submit" name="Add Member" />
          ) : (
            <PrimaryButton type="submit" name="Add Member" disabled />
          )}
        </form>
      </Modal>

      <main className="min-h-screen w-full">
        <Header name={name || ""} imgUrl={imgUrl} />
        <div className="p-5">
          <div className="relative overflow-x-auto rounded-lg shadow-md">
            {/* search and add member section  */}
            <div className="flex items-center bg-white px-4 py-4">
              <label className="sr-only">Search</label>
              <div className="relative mr-4">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-500"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 "
                  placeholder="Search for users"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <button
                onClick={() => {
                  setModalIsOpen(true);
                }}
                className="flex items-center justify-between rounded-lg bg-purple-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-purple-800 "
              >
                <FiUserPlus className="mr-2" />
                Add Member
              </button>
            </div>

            {/* member table  */}
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member.memberId}
                    className="bg-white hover:bg-gray-50"
                  >
                    <td className="flex items-center whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                      {member.memberAvatarUrl ? (
                        <Image
                          src={member.memberAvatarUrl || ""}
                          alt="Jese image"
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full">
                          <AvatarPlaceholder name={member.memberEmail || ""} />
                        </div>
                      )}
                      <div className="pl-3">
                        <div className="text-base font-semibold">
                          {member.memberName}
                        </div>
                        <div className="font-normal text-gray-500">
                          {member.memberEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Select
                        initialValue={member.memberRole || "Researcher"}
                        onValueChange={(newRole) =>
                          handleRoleChange(member.memberId, newRole)
                        }
                      />
                    </td>
                    <td className="px-6 py-4">
                      {member.memberId != userId && (
                        <a
                          type="button"
                          className="cursor-pointer font-medium text-purple-600 hover:underline"
                          onClick={() => handleDeleteMember(member.memberId)}
                        >
                          Remove user
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

Members.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default Members;
