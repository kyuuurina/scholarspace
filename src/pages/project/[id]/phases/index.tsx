// utils
import { useRouterId } from "~/utils/routerId";
import { FiLayout } from "react-icons/fi";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";

// local components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import PageLoader from "~/components/layout/PageLoader";

import { useState, useEffect } from "react";

const Phase: NextPageWithLayout = () => {
  // get project id from router
  const id = useRouterId();

  // get phases from api
  const phases = api.phase.list.useQuery({ project_id: id }, { enabled: !!id });

  // state to store the selected phase
  const [selectedPhase, setSelectedPhase] = useState("");

  // get phase from api
  const phase = api.phase.get.useQuery({
    id: selectedPhase,
  });

  const renderPhase = (phaseId: string) => {
    // update the selected phase state
    setSelectedPhase(phaseId);
  };

  useEffect(() => {
    // Set the default selected phase when the component mounts
    if (phases.data && phases.data.length > 0 && !selectedPhase) {
      // Ensure phase.data[0] is not undefined before accessing its properties
      const firstPhase = phases.data[0];
      if (firstPhase) {
        setSelectedPhase(firstPhase.id);
      }
    }
  }, [phases.data, selectedPhase]);

  return (
    <>
      <Head title="name" />
      <PageLoader isLoading={phases.isLoading} errorMsg={phases.error?.message}>
        <main className="flex flex-col">
          {/* render phases in a clickable button that renders a phase within the page */}
          <div className="flex flex-wrap gap-2">
            {phases.data?.map((phase) => (
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
              <h1 className="text-2xl font-bold">{phase.data?.name}</h1>
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
