import { type ReactElement, useState } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import Head from "~/components/layout/Head";
import Layout from "~/components/layout/Layout";
import React from "react";
import { api } from "~/utils/api";
import { phase_template } from "@prisma/client";

const ManageTemplates: NextPageWithLayout = () => {
  // get templates of the user
  const { data: templates, refetch: refetchTemplates } =
    api.template.list.useQuery();

  const [selectedTemplate, setSelectedTemplate] =
    useState<phase_template | null>(null);

  return (
    <div className="w-full max-w-screen-xl p-8">
      <h1 className="truncate pb-4 text-2xl font-bold sm:text-4xl">
        Manage Templates
      </h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <ul className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-5">
            {templates?.map((template) => (
              <li
                className="block cursor-pointer items-center p-3 hover:bg-gray-100 sm:flex"
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
              >
                <p className="font-medium text-gray-900">{template.name}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-3 ">
          {selectedTemplate && (
            <div>
              <h1>{selectedTemplate.name}</h1>
              <table className="max-w-min border border-gray-200 text-left text-sm text-gray-700">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr className="whitespace-nowrap border border-gray-300 px-6 py-4">
                    {selectedTemplate.phase_template_properties.map(
                      (property) => (
                        <th
                          className="border border-gray-300 px-6 py-4"
                          key={property}
                        >
                          {property}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-gray-300 px-6 py-4">
                    {selectedTemplate.phase_template_properties.map(
                      (property) => (
                        <td
                          className="border border-gray-300 px-6 py-4"
                          key={property}
                        >
                          <span> </span>
                        </td>
                      )
                    )}
                  </tr>
                  <tr className="border border-gray-300 px-6 py-4">
                    {selectedTemplate.phase_template_properties.map(
                      (property) => (
                        <td
                          className="border border-gray-300 px-6 py-4"
                          key={property}
                        >
                          <span> </span>
                        </td>
                      )
                    )}
                  </tr>
                  <tr className="border border-gray-300 px-6 py-4">
                    {selectedTemplate.phase_template_properties.map(
                      (property) => (
                        <td
                          className="border border-gray-300 px-6 py-4"
                          key={property}
                        >
                          <span> </span>
                        </td>
                      )
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
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
