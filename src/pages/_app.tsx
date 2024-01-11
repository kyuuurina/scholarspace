/* eslint-disable @typescript-eslint/ban-types */
import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { api } from "~/utils/api";
import Head from "~/components/layout/Head";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "~/components/ErrorBoundary";
import "~/styles/globals.css";
import { Inter } from "next/font/google";
import "@mantine/tiptap/styles.css";
import { MantineProvider, MantineTheme } from "@mantine/core";
import NavigationLoader from "~/components/NavigationLoader";
// supabase helpers for authentication and authorization
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import {
  SessionContextProvider,
  type Session,
} from "@supabase/auth-helpers-react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export const poppins = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const MyApp = ({
  Component,
  pageProps: { initialSession, ...pageProps },
}: AppPropsWithLayout) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head />
      <ErrorBoundary>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={initialSession as Session}
        >
          <MantineProvider>
            <NavigationLoader />
            <div className={`${poppins.className}`}>
              {getLayout(<Component {...pageProps} />)}
              <Toaster />
            </div>
          </MantineProvider>
        </SessionContextProvider>
      </ErrorBoundary>
    </>
  );
};

export default api.withTRPC(MyApp);
