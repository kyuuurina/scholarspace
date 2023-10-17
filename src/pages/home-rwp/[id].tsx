/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */

//please refer to: src>pages>workspace>id.tsx

//utils
import { useRouterId } from "~/utils/routerId";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// pages
import ErrorPage from "~/pages/error-page";

// local components

import Layout from "~/components/layout/Layout";

import Head from "~/components/layout/Head";
import LoadingSpinner from "~/components/LoadingSpinner";
import PrimaryButton from "~/components/button/PrimaryButton";


import Card from "~/components/Card";
import AvatarPlaceholder from "~/components/AvatarPlaceholder";

import Image from "next/image";
import Link from "next/link";


const ResearchPostsPage = () => {
  return (
    <div className="mx-auto max-w-screen-xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Research Posts</h1>
    </div>
  );
};

export default ResearchPostsPage;