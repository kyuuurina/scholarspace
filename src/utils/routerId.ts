import { useRouter } from "next/router";

export const useRouterId = () => {
  const router = useRouter();
  const id = router.query && router.query.id ? router.query.id.toString() : "";

  return id;
};

export const useDoubleRouterId = () => {
  const router = useRouter();
  const id = router.query && router.query.id ? router.query.id.toString() : "";
  const id2 =
    router.query && router.query.phase_id
      ? router.query.phase_id.toString()
      : "";

  return { id, id2 };
};
