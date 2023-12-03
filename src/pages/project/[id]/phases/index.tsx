// utils
import { useRouterId } from "~/utils/routerId";
import { FiLayout } from "react-icons/fi";
import { useRouter } from "next/router";
import { useFetchProject } from "~/utils/project";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";

// local components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import PageLoader from "~/components/layout/PageLoader";

import { useState, useEffect } from "react";
import { set } from "zod";

const Phase: NextPageWithLayout = () => {
  // get project id from router
  const id = useRouterId();
  const router = useRouter();
  const { name } = useFetchProject();

  // get phases from api
  const {
    data: phases,
    isLoading: phasesIsLoading,
    error: phasesError,
  } = api.phase.list.useQuery({ project_id: id }, { enabled: !!id });

  // state to store the selected phase
  const [selectedPhase, setSelectedPhase] = useState("");

  // states for isAdding button
  const [isAdding, setIsAdding] = useState(false);

  // get phase from api
  const {
    data: phase,
    isLoading: phaseIsLoading,
    error: phaseError,
  } = api.phase.get.useQuery({
    id: selectedPhase,
  });

  // boolean conditions for loading and error
  const isLoading = phasesIsLoading || phaseIsLoading;
  const error = phasesError || phaseError;

  const renderPhase = (phaseId: string) => {
    // update the selected phase state
    setSelectedPhase(phaseId);
  };

  // create phase
  const createPhase = api.phase.create.useMutation();

  // function to create phase with default name phase1
  const handleCreatePhase = () => {
    // if isAdding is true, then exit the function
    if (isAdding) return;
    else {
      setIsAdding(true);
      // await for createPhase to finish executing, then set isAdding to false
      createPhase.mutate(
        {
          project_id: id,
          name: "phase1",
        },
        {
          onSuccess: () => {
            setIsAdding(false);
            router.reload();
          },
        }
      );
    }
  };

  useEffect(() => {
    // Set the default selected phase when the component mounts
    if (phases && phases.length > 0 && !selectedPhase) {
      // Ensure phase.data[0] is not undefined before accessing its properties
      const firstPhase = phases[0];
      if (firstPhase) {
        setSelectedPhase(firstPhase.id);
      }
    }
  }, [phases, selectedPhase]);

  return (
    <>
      <Head title={name} />
      <PageLoader isLoading={isLoading} errorMsg={error?.message}>
        <main className="flex flex-col">
          {/* add phase button */}
          <div className="flex justify-end">
            <button
              className="rounded-md border border-gray-300 bg-gray-200 p-2 hover:bg-gray-400"
              onClick={() => handleCreatePhase()}
            >
              <div className="flex items-center">
                <FiLayout />
                <span className="ml-2 text-xs">Add Phase</span>
              </div>
            </button>
          </div>
          {/* render phases in a clickable button that renders a phase within the page */}
          <div className="flex flex-wrap gap-2">
            {phases?.map((phase) => (
              <button
                key={phase.id}
                className="rounded-md border border-gray-300 bg-gray-200 p-2 hover:bg-gray-400"
                onClick={() => renderPhase(phase.id)}
              >
                <div className="flex items-center">
                  <FiLayout />
                  <span className="ml-2 text-xs">{phase.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* render selected phase */}
          {selectedPhase && (
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">{phase?.name}</h1>
            </div>
          )}
        </main>
      </PageLoader>
    </>
  );
};

Phase.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default Phase;
