/* eslint-disable @typescript-eslint/ban-types */
import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { api } from "~/utils/api";
import Head from "~/components/layout/Head";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "~/components/ErrorBoundary";
import { Inter } from "next/font/google";
import { MantineProvider } from "@mantine/core";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import {
  SessionContextProvider,
  type Session,
} from "@supabase/auth-helpers-react";

import "~/styles/globals.css";
import "@mantine/tiptap/styles.css";

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
