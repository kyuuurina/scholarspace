import React from "react";
import { useRouter } from "next/router";
import { MoonLoader } from "react-spinners";

const LOADER_THRESHOLD = 250;

export default function NavigationLoader(props: { text?: string }) {
  const { text = "Loading..." } = props;
  const [isLoading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    const start = () =>
      (timer = setTimeout(() => setLoading(true), LOADER_THRESHOLD));

    const end = () => {
      if (timer) {
        clearTimeout(timer);
      }
      setLoading(false);
    };

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [router.events]);

  if (!isLoading) return null;

  return (
    <div className="navigation-loader">
      <MoonLoader size={100} color="#6233D5" />
    </div>
  );
}
