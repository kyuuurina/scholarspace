import { api } from "~/utils/api";

interface Option {
  readonly label: string;
  readonly value: string;
}

export const useListResearchInterests = () => {
  const { data } = api.researchInterest.listAll.useQuery();
  const researchInterests: Option[] = [];
  data?.forEach((skill) => {
    researchInterests.push({
      label: skill.name,
      value: skill.name,
    });
  });

  const refetch = api.researchInterest.listAll.useQuery().refetch;
  return { researchInterests, refetch };
};

export const useListResearchSkills = () => {
  const { data } = api.researchSkill.listAll.useQuery();
  const researchSkills: Option[] = [];
  data?.forEach((skill) => {
    researchSkills.push({
      label: skill.name,
      value: skill.name,
    });
  });

  const refetch = api.researchSkill.listAll.useQuery().refetch;
  return { researchSkills, refetch };
};
