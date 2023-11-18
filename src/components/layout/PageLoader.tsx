import type { ReactNode } from "react";
import LoadingSpinner from "~/components/LoadingSpinner";
import ErrorPage from "~/pages/error-page";

type PageLoaderProps = {
  isLoading: boolean;
  errorMsg: string | undefined;
  children: ReactNode;
};

const PageLoader: React.FC<PageLoaderProps> = ({
  isLoading,
  errorMsg,
  children,
}) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (errorMsg) {
    return <ErrorPage error={errorMsg} />;
  }

  return <>{children}</>;
};

export default PageLoader;
