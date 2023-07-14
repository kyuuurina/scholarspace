/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  createPagesServerClient,
  type User,
} from "@supabase/auth-helpers-nextjs";

import type { Context } from "~/types/context";

export const getUserFromContext = async (
  ctx: Context
): Promise<User | null> => {
  const supabaseServerClient = createPagesServerClient(ctx);

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  return user;
};
