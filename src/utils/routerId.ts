import { useRouter } from "next/router";

export const useRouterId = () => {
  const router = useRouter();
  const id = router.query && router.query.id ? router.query.id.toString() : "";

  return id;
};
