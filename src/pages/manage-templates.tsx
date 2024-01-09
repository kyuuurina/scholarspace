import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import Head from "~/components/layout/Head";
import Layout from "~/components/layout/Layout";
import React from "react";
import { api } from "~/utils/api";

const ManageTemplates: NextPageWithLayout = () => {
  // get templates of the user
  const { data: templates, refetch: refetchTemplates } =
    api.template.list.useQuery();
  return (
    <div className="w-full max-w-screen-xl p-8">
      <h1 className="truncate pb-4 text-2xl font-bold sm:text-4xl">
        Manage Templates
      </h1>
      <ul>
        {templates?.map((template) => (
          <li key={template.id}>
            <p>{template.name}</p>
          </li>
        ))}
      </ul>
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
