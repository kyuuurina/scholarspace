import { useState } from "react";
import { type UseFormSetValue } from "react-hook-form";
import type { FormData } from "~/types/profile";

type BasicInfoFormProps = {
  setValue: UseFormSetValue<FormData>;
};

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ setValue }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // Track selected status

  const setCollaborationStatus = (newValue: string) => {
    setValue("collab_status", newValue);
    setSelectedStatus(newValue); // Update selected status
  };

  return (
    <>
      <div className="my-6">
        <div className="flex space-y-3 sm:flex-col">
          <div className="space-y-4">
            <div className="flex justify-between space-x-5">
              <div className="w-1/2">
                <label
                  htmlFor="research_interest"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Research Collaboration Interest
                </label>
                {/* Replace CreatableSingleSelect with two cards */}
                <div className="flex space-x-3">
                  <div
                    className={`block cursor-pointer rounded-lg border p-2 ${
                      selectedStatus === "Open For Collaboration"
                        ? "border-purple-accent-1 bg-purple-100"
                        : "border-gray-200 bg-white"
                    } p-2 shadow hover:bg-gray-200`}
                    onClick={() =>
                      setCollaborationStatus("Open For Collaboration")
                    }
                  >
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 ">
                      Open for Collaboration
                    </h5>
                    <p className="font-normal text-gray-700 ">
                      Let other researchers know you are open for collaborating
                      on research projects.
                    </p>
                  </div>

                  <div
                    className={`block cursor-pointer rounded-lg border p-2 ${
                      selectedStatus === "Not Open For Collaboration"
                        ? "border-purple-accent-1 bg-purple-100"
                        : "border-gray-200 bg-white"
                    } p-2 shadow hover:bg-gray-200`}
                    onClick={() =>
                      setCollaborationStatus("Not Open For Collaboration")
                    }
                  >
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 ">
                      Not Open for Collaboration
                    </h5>
                    <p className="font-normal text-gray-700 ">
                      Let other researchers know you are not open for
                      collaborating on research projects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicInfoForm;
