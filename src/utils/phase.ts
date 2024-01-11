import { api } from "./api";

export const useFetchProjectId = (phase_id: string) => {
  const phaseQuery = api.phase.get.useQuery(
    {
      id: phase_id,
    },
    {
      enabled: !!phase_id,
    }
  );

  return phaseQuery.data?.project_id;
};
