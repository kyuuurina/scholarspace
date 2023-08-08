import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create authenticated Supabase Client.
  const supabase = createMiddlewareClient({ req, res });

  const supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey: string | undefined =
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

  const supabaseWithSecret = createClient(
    supabaseUrl as string,
    serviceRoleKey as string
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Forward to protected route if we have a session
  if (session) {
    // Check if the user has a profile
    const { data: profileData, error } = await supabaseWithSecret
      .from("Profile")
      .select()
      .eq("userId", session.user.id);

    if (error) {
      console.error("Error fetching profile data:", error);
    }

    // If the user does not have a profile, redirect to profile registration
    if (!profileData || profileData.length === 0) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/profile-registration"; // Adjust the path to your profile registration page
      return NextResponse.redirect(redirectUrl);
    }

    // If the user has a profile, redirect to home page
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/"; // Adjust the path to your home page
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ["/", "/home-rwp", "/manage-profile", "/workspace"],
};
