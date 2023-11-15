//testing page for profile search results

import React, { useState } from 'react';
// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

//local components
import Layout from "~/components/layout/Layout";
import MiniUserCard from '~/components/profile/MiniUserCard';

const ProfilePage: NextPageWithLayout = () => {




  return (
    <div>
        {/* <MiniUserCard>
            
        </MiniUserCard> */}
    </div>
  )

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
