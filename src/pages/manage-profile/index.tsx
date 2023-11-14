import React, { useState } from 'react';
// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

//local components
import Layout from "~/components/layout/Layout";

const ProfilePage: NextPageWithLayout = () => {




  //Scholarspace layout
  return (
    <>
      <Layout>
        <div>Profile Page</div>
      </Layout>
    </>
  );
}

export default ProfilePage;
