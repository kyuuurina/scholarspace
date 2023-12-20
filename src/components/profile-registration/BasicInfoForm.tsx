import { type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import type { FormData } from "~/types/profile";
import CreatableSingleSelect from "../form/CreatableSingleSelect";
import {
  useListResearchInterests,
  useListResearchSkills,
} from "~/utils/researchOptions";
import { api } from "~/utils/api";

type BasicInfoFormProps = {
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
};

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  register,
  setValue,
}) => {
  const { refetch: refetchInterests, researchInterests } =
    useListResearchInterests();
  const createResearchInterest = api.researchInterest.create.useMutation();
  const createResearchInterestOption = async (inputValue: string) => {
    await createResearchInterest.mutateAsync({ name: inputValue });
    await refetchInterests();
  };
  const setResearchInterest = (newValue: string) => {
    setValue("research_interest", newValue);
  };

  const { refetch: refetchSkills, researchSkills } = useListResearchSkills();
  const createResearchSkill = api.researchSkill.create.useMutation();
  const createResearchSkillOption = async (inputValue: string) => {
    await createResearchSkill.mutateAsync({ name: inputValue });
    await refetchSkills();
  };
  const setResearchSkill = (newValue: string) => {
    setValue("skills", newValue);
  };

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
                Name
              </label>
              <input
                id="name"
                className="block w-full"
                {...register("name", { required: true })}
              />
            </div>
            <div className="flex justify-between space-x-5">
              <div className="w-1/2">
                <label
                  htmlFor="research_interest"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Research Interest
                </label>
                <CreatableSingleSelect
                  optionsArr={researchInterests}
                  createValue={createResearchInterestOption}
                  setValue={setResearchInterest}
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="skills"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Skills
                </label>
                <CreatableSingleSelect
                  optionsArr={researchSkills}
                  createValue={createResearchSkillOption}
                  setValue={setResearchSkill}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="aboutMe"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                About Me
              </label>
              <textarea
                id="about_me"
                rows={4}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Write about yourself"
                {...register("about_me", { required: true })}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicInfoForm;
