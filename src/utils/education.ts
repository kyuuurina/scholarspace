/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/utils/education.ts

//note: import educationrouter in root.ts

import { api } from "./api";
import { useRouterId } from "./routerId";

type Education = {
  education_id: string;
  school_name: string;
  start_date: Date;
  end_date: Date;
};

export const useFetchProfileEducation = () => {
  const profileId: string = useRouterId();

  const educationQuery = api.education.getProfileEducation.useQuery(
    {
      profile_id: profileId,
    },
    {
      enabled: !!profileId,
    }
  );

  const { isLoading, error, data } = educationQuery;

  const profileEducation: Education[] = data || [];

  return {
    profileEducation,
    isLoading,
    error,
  };
};

export const useCreateEducation = () => {
  const profileId: string = useRouterId();

  const createEducationMutation = api.education.create.useMutation();

  const handleCreateEducation = async (educationData: {
    school_name: string;
    start_date: Date;
    end_date: Date;
  }) => {
    try {
      await createEducationMutation.mutate({
        profile_id: profileId,
        ...educationData,
      });
    } catch (error) {
      console.error("Error creating education:", error);
    }
  };

  return {
    createEducation: handleCreateEducation,
  };
};

export const useUpdateEducation = () => {
  const updateEducationMutation = api.education.update.useMutation();

  const handleUpdateEducation = async (educationData: {
    education_id: string;
    school_name: string;
    start_date: Date;
    end_date: Date;
  }) => {
    try {
      await updateEducationMutation.mutate(educationData);
    } catch (error) {
      console.error("Error updating education:", error);
    }
  };

  return {
    updateEducation: handleUpdateEducation,
  };
};

export const useDeleteEducation = () => {
  const deleteEducationMutation = api.education.delete.useMutation();

  const handleDeleteEducation = async (educationId: string) => {
    try {
      await deleteEducationMutation.mutate({
        education_id: educationId,
      });
    } catch (error) {
      console.error("Error deleting education:", error);
    }
  };

  return {
    deleteEducation: handleDeleteEducation,
  };
};
