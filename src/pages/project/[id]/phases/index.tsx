// utils
import { useRouterId } from "~/utils/routerId";
import { useRouter } from "next/router";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import type { phase } from "@prisma/client";

// local components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import PageLoader from "~/components/layout/PageLoader";
import Header from "~/components/phase/Header";
import Table from "~/components/phase/Table";

import { useState, useEffect } from "react";

const Phase: NextPageWithLayout = () => {
  // get project id from router
  const id = useRouterId();

  const {
    data: project,
    isLoading: projectIsLoading,
    error: projectError,
  } = api.project.get.useQuery({ project_id: id }, { enabled: !!id });

  // get phases from api
  const {
    data: phases,
    isLoading: phasesIsLoading,
    error: phasesError,
  } = api.phase.list.useQuery({ project_id: id }, { enabled: !!id });

  // state to store the selected phase
  const [selectedPhase, setSelectedPhase] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // boolean conditions for loading and error
  const isLoading = phasesIsLoading;
  const error = phasesError;

  const handleSelectPhase = (phaseId: string) => {
    // update the selected phase state
    setSelectedPhase(phaseId);
  };
  const [safePhases, setSafePhases] = useState<phase[]>([]); // Replace 'phase' with the actual type of your phases

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    // Set the default selected phase when the component mounts
    if (phases && phases.length > 0 && !selectedPhase) {
      // Ensure phase.data[0] is not undefined before accessing its properties
      setSafePhases(phases);
      const firstPhase = phases[0];
      if (firstPhase) {
        setSelectedPhase(firstPhase.id);
      }
    }
  }, [phases, selectedPhase]);

  return (
    <>
      <Head title={project?.name ? `${project.name} - Phase` : "Phase"} />
      <PageLoader isLoading={isLoading} errorMsg={error?.message}>
        <main className="flex flex-col">
          {/* render header */}
          <Header
            phases={safePhases}
            onSelectPhase={handleSelectPhase}
            selectedPhase={selectedPhase}
            name={project?.name || "Project"}
          />
          {/* selected phase section */}
          <section className="p-2">
            {selectedPhase && (
              <div className="relative space-y-4 overflow-hidden rounded-md bg-white px-6 py-2 shadow-sm">
                <div className="flex flex-col items-center justify-between md:flex-row">
                  <input
                    type="text"
                    className="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900"
                    placeholder="Search for tasks"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="overflow-x-auto">
                  <Table phase_id={selectedPhase} searchQuery={searchQuery} />
                </div>
              </div>
            )}
          </section>
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
