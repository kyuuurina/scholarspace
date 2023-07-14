/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AppType } from "next/app";
import {
  createPagesBrowserClient,
  type Session,
} from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useState } from "react";

type Props = {
  initialSession: Session;
};

// components
import { NavBar } from "~/components/NavBar";
import { SideBar } from "~/components/SideBar";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<Props> = ({ Component, pageProps }) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <div className="flex min-h-screen">
          <SideBar />
          <div className="light:black flex-grow dark:text-white">
            <NavBar />
            <Component {...pageProps} />
          </div>
        </div>
      </SessionContextProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
