import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import Head from "~/components/layout/Head";
import Layout from "~/components/layout/Layout";
import React from "react";
import NotificationsCard from "~/components/settings/NotificationsCard";
import { Knock } from "@knocklabs/node";
import { useUser } from "@supabase/auth-helpers-react";
import { api } from "~/utils/api";

const Settings: NextPageWithLayout = () => {
  const user = useUser();

  const knockClient = new Knock(process.env.KNOCK_SECRET_API_KEY || "");
  const { data, refetch } = api.notifications.getSettings.useQuery();

  const handleNotifClick = async () => {
    await knockClient.notify("new-workout", {
      actor: user?.id || "",
      recipients: [user?.id || ""],
      data: {
        task: {
          value: "Task 1",
        },
        variableKey: "Preview data value",
        isWebEnabled: data?.web_enbld,
        isEmailEnabled: data?.email_enbld,
      },
    });
  };

  const refetchSettings = async () => {
    await refetch();
  };
  return (
    <div className="w-full max-w-screen-xl p-8">
      <h1 className="truncate pb-4 text-2xl font-bold sm:text-4xl">Settings</h1>
      {data && <NotificationsCard notifWeb={data} refetch={refetchSettings} />}
      <button
        onClick={async () => {
          await handleNotifClick();
        }}
        className="m-2 rounded-md border border-purple-accent-2 p-4 hover:bg-purple-accent-2 hover:text-white"
      >
        Click me to send a notif
      </button>
    </div>
  );
};

Settings.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head title="Settings" />
      <Layout>{page}</Layout>
    </>
  );
};

export default Settings;
