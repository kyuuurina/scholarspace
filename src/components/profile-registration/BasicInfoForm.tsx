// i want this file
import { useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type BasicInfoData = {
  name: string;
  education: string | undefined;
  // contactNum: string;
  aboutMe: string;
};

type BasicInfoFormProps = BasicInfoData & {
  updateFields: (fields: Partial<BasicInfoData>) => void;
};

const educationOptions = [
  { value: "Universiti Malaya", label: "Universiti Malaya" },
  {
    value: "Universiti Teknologi Malaysia",
    label: "Universiti Teknologi Malaysia",
  },
  { value: "Universiti Sains Malaysia", label: "Universiti Sains Malaysia" },
];

export function BasicInfoForm({
  name,
  // contactNum,
  education,
  aboutMe,
  updateFields,
}: BasicInfoFormProps) {
  return (
    <>
      <div className="my-6">
        <div className="flex space-y-3 sm:flex-col">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter your full name"
                required
                value={name}
                onChange={(e) => updateFields({ name: e.target.value })}
              />
            </div>
            <div>
              <label
                htmlFor="education"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Institution
              </label>
            </div>
            {/* <div>
              <label
                htmlFor="contactNum"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Contact Number
              </label>
              <input
                type="string"
                name="contactNum"
                id="contactNum"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Write your contact number"
                required
                value={contactNum}
                onChange={(e) => updateFields({ contactNum: e.target.value })}
              />
            </div> */}
            <div>
              <label
                htmlFor="aboutMe"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                About
              </label>
              <textarea
                id="aboutMe"
                rows={4}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Write aboutMe yourself"
                value={aboutMe}
                onChange={(e) => updateFields({ aboutMe: e.target.value })}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
