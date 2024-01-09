import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import Head from "~/components/layout/Head";
import Layout from "~/components/layout/Layout";
import React from "react";

const ManageTemplates: NextPageWithLayout = () => {
  return (
    <div className="w-full max-w-screen-xl p-8">
      <h1 className="truncate pb-4 text-2xl font-bold sm:text-4xl">
        Manage Templates
      </h1>
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
