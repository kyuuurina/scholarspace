// utils
import { useRouterId } from "~/utils/routerId";
import { api } from "~/utils/api";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import Header from "~/components/workspace/Header";
import Card from "~/components/Card";
import MembersCard from "~/components/members/MembersCard";
import ScoreChart from "~/components/chart/ScoreChart";
import PageLoader from "~/components/layout/PageLoader";
import GanttChart from "~/components/project/GanttChart";
import React from "react";

const Project: NextPageWithLayout = () => {
  const id = useRouterId();

  return (
    <>
      <h1>Hello</h1>
    </>
  );
};

Project.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default Project;
