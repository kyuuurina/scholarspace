import React from "react";
import FollowersList from "~/components/network/FollowerList";
import { useRouterId } from "~/utils/routerId";



const TestPage: React.FC = () => {

const id = useRouterId();

    return (
      <div>
        <h1>Test Page</h1>
        <FollowersList />
      </div>
    );
  };
  
  export default TestPage;