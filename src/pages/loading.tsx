import React from "react";
import { PropagateLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex min-h-full items-center justify-center">
      <PropagateLoader
        color={"#6233D5"}
        loading={true}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loading;
