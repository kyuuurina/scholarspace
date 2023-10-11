import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
import { useSessionContext } from "@supabase/auth-helpers-react";

export const useGetUser = () => {
  const { session } = useSessionContext();

  return session?.user;
};
