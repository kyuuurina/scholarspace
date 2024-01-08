import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import Head from "~/components/layout/Head";
import Layout from "~/components/layout/Layout";
import React, { useState } from "react";
import NotificationsCard from "~/components/settings/NotificationsCard";
import { NextApiRequest, NextApiResponse } from "next";

type Email = {
  id: string;
};

const Settings: NextPageWithLayout = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      setError(null);

      // Make your API request here
      const response: Response = await fetch("/api/send"); // Update with your API route
      // const data = response;

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      console.log("Email sent successfully", response);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-screen-xl p-8">
      <h1 className="truncate pb-4 text-2xl font-bold sm:text-4xl">Settings</h1>
      <button
        onClick={handleSendEmail}
        disabled={loading}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        {loading ? "Sending..." : "Send Test Email"}
      </button>
      {error && <div className="mt-2 text-red-500">{error}</div>}
      <NotificationsCard />
    </div>
  );
};

Settings.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head title="Main Page" />
      <Layout>{page}</Layout>
    </>
  );
};

export default Settings;
