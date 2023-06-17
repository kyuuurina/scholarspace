import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";

import { NavBar } from "~/components/NavBar";
import { SideBar } from "~/components/SideBar";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <div className="flex min-h-screen">
        <SideBar />
        <div className="light:black flex-grow dark:text-white">
          <NavBar />
          <Component {...pageProps} />
        </div>
      </div>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
