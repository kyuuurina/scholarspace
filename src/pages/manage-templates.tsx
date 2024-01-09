import { type ReactElement, useState, useEffect } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import Head from "~/components/layout/Head";
import Layout from "~/components/layout/Layout";
import React from "react";
import { api } from "~/utils/api";
import { type phase_template } from "@prisma/client";
import { FiPlusCircle } from "react-icons/fi";
import PrimaryButton from "~/components/button/PrimaryButton";
import ErrorToast from "~/components/toast/ErrorToast";
import { TRPCClientError } from "@trpc/client";
import toast from "react-hot-toast";
import { DeleteButton } from "~/components/button/DeleteButton";

const ManageTemplates: NextPageWithLayout = () => {
  // get templates of the user
  const { data: templates, refetch: refetchTemplates } =
    api.template.list.useQuery();

  const [selectedTemplate, setSelectedTemplate] =
    useState<phase_template | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddColumnVisible, setIsAddColumnVisible] = useState(false);
  const [editedHeader, setEditedHeader] = useState("");
  const [addProperties, setAddProperties] = useState<string[]>([]);
  const [addPhaseName, setAddPhaseName] = useState("Phase Title"); // New state for editable header

  useEffect(() => {
    setSelectedTemplate(templates?.[0] ?? null);
  }, [templates]);

  const handleAddColumnClick = () => {
    setIsAddColumnVisible(!isAddColumnVisible); // Step 2
  };

  const handleHeaderBlur = () => {
    setIsAddColumnVisible(false); // Hide the editable column
  };

  const handleHeaderChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if ("key" in event && event.key === "Enter" && editedHeader.trim() !== "") {
      setAddProperties((prevProperties) => {
        const newProperties = [...prevProperties, editedHeader.trim()];
        setEditedHeader(""); // Reset the input field
        setIsAddColumnVisible(false);
        console.log(newProperties);
        return newProperties; // Return the updated state
      });
    }
  };

  const handleAddPhaseNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAddPhaseName(event.target.value);
  };

  const addTemplate = api.template.create.useMutation();
  const onSubmit = async () => {
    if (addPhaseName.trim() === "") {
      return;
    }
    try {
      await addTemplate.mutateAsync({
        name: addPhaseName,
        phase_template_properties: addProperties,
      });
    } catch (error) {
      toast.custom(() => {
        if (error instanceof TRPCClientError) {
          return <ErrorToast message={error.message} />;
        } else {
          // Handle other types of errors or fallback to a default message
          return <ErrorToast message="An error occurred." />;
        }
      });
    }
    setAddPhaseName("");
    setAddProperties([]);
    setIsAdding(false);
    await refetchTemplates();
  };

  const handleCancel = () => {
    setAddPhaseName("Phase Title");
    setAddProperties([]);
  };

  // delete template
  const deleteTemplate = api.template.delete.useMutation();

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteTemplate.mutateAsync({ id: templateId });
      await refetchTemplates();
      setSelectedTemplate(null);
    } catch (error) {
      toast.custom(() => {
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
    <div className="w-full max-w-screen-xl p-8">
      <h1 className="truncate pb-4 text-2xl font-bold sm:text-4xl">
        Manage Templates
      </h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <ul className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-5">
            {templates?.map((template) => (
              <li
                className="block cursor-pointer items-center p-3 hover:bg-gray-100 sm:flex"
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template), setIsAdding(false);
                }}
              >
                <p className="font-medium text-gray-900">{template.name}</p>
              </li>
            ))}
            <li
              className="block cursor-pointer items-center p-3 hover:bg-gray-100 sm:flex"
              key={1}
              onClick={() => {
                setIsAdding(true), setSelectedTemplate(null);
              }}
            >
              <p className="flex items-center justify-center space-x-3 font-medium text-purple-900">
                <FiPlusCircle />
                <span>Add Template</span>
              </p>
            </li>
          </ul>
        </div>
        <div className="col-span-3 ">
          {selectedTemplate && (
            <div>
              <div className="flex justify-between py-2">
                <h1 className="text-2xl font-semibold text-gray-700">
                  {selectedTemplate.name}
                </h1>
                <DeleteButton
                  onClick={async () => {
                    await handleDeleteTemplate(selectedTemplate.id);
                  }}
                  name="Delete Template"
                />
              </div>
              <table className="max-w-min border border-gray-200 text-left text-sm text-gray-700">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr className="whitespace-nowrap border border-gray-300 px-6 py-4">
                    {selectedTemplate.phase_template_properties.map(
                      (property) => (
                        <th
                          className="border border-gray-300 px-6 py-4"
                          key={property}
                        >
                          {property}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-gray-300 px-6 py-4">
                    {selectedTemplate.phase_template_properties.map(
                      (property) => (
                        <td
                          className="border border-gray-300 px-6 py-4"
                          key={property}
                        >
                          <span> </span>
                        </td>
                      )
                    )}
                  </tr>
                  <tr className="border border-gray-300 px-6 py-4">
                    {selectedTemplate.phase_template_properties.map(
                      (property) => (
                        <td
                          className="border border-gray-300 px-6 py-4"
                          key={property}
                        >
                          <span> </span>
                        </td>
                      )
                    )}
                  </tr>
                  <tr className="border border-gray-300 px-6 py-4">
                    {selectedTemplate.phase_template_properties.map(
                      (property) => (
                        <td
                          className="border border-gray-300 px-6 py-4"
                          key={property}
                        >
                          <span> </span>
                        </td>
                      )
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {isAdding && (
            <div>
              <h1 className="truncate pb-4 text-2xl font-bold sm:text-4xl">
                {isAdding ? (
                  <input
                    type="text"
                    value={addPhaseName}
                    onChange={handleAddPhaseNameChange}
                  />
                ) : (
                  addPhaseName
                )}
              </h1>
              <table className="max-w-min border border-gray-200 text-left text-sm text-gray-700">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr className="whitespace-nowrap border border-gray-300 px-6 py-4">
                    {addProperties.map((property, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="border border-gray-300 px-6 py-3"
                      >
                        {property}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="border border-gray-300 px-6 py-3"
                    >
                      {isAddColumnVisible ? (
                        <input
                          type="text"
                          value={editedHeader}
                          autoFocus
                          onBlur={handleHeaderBlur}
                          onChange={(event) => {
                            event.persist();
                            setEditedHeader(event.target.value);
                          }}
                          onKeyUp={(event) => {
                            if (event.key === "Enter") {
                              handleHeaderChange(event);
                            }
                          }}
                        />
                      ) : (
                        <span
                          className="cursor-pointer font-normal text-gray-500"
                          onClick={() => handleAddColumnClick()}
                        >
                          Add a property here...
                        </span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-gray-300 px-6 py-4">
                    {addProperties.map((property, index) => (
                      <td
                        key={index}
                        className="border border-gray-300 px-6 py-4"
                      >
                        <span> </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border border-gray-300 px-6 py-4">
                    {addProperties.map((property, index) => (
                      <td
                        key={index}
                        className="border border-gray-300 px-6 py-4"
                      >
                        <span> </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border border-gray-300 px-6 py-4">
                    {addProperties.map((property, index) => (
                      <td
                        key={index}
                        className="border border-gray-300 px-6 py-4"
                      >
                        <span> </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              {!isAddColumnVisible && (
                <div className="flex items-center justify-start space-x-5 py-4">
                  <button
                    onClick={() => handleCancel()}
                    className="rounded-lg border border-purple-accent-1 bg-white px-3 py-2 text-center text-sm font-medium text-purple-accent-1 hover:border-none hover:bg-purple-accent-2 hover:text-white focus:outline-none"
                    disabled={
                      addPhaseName.trim() === "" || addProperties.length === 0
                    }
                  >
                    Reset
                  </button>

                  <PrimaryButton
                    name="Save"
                    onClick={() => onSubmit()}
                    disabled={
                      addPhaseName.trim() === "" || addProperties.length === 0
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ManageTemplates.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head title="Manage Templates" />
      <Layout>{page}</Layout>
    </>
  );
};

export default ManageTemplates;
