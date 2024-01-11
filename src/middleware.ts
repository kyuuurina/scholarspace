import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next();

  // Create authenticated Supabase Client.
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Forward to protected route if we have a session
  if (session) {
    // Check if the user has a profile
    const { data: profileData, error } = await supabase
      .from("profile")
      .select()
      .eq("user_id", session.user.id); // Adjust the column names as per your schema

    console.log(profileData);

    if (error) {
      console.error(error);
    }

    // If the user does not have a profile, redirect to profile registration
    if (!profileData || profileData.length === 0) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/profile-registration"; // Adjust the path to your profile registration page
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  }

  // Auth condition not met, redirect to login page.
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = "/signin";
  redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/", "/home-rwp", "/manage-profile", "/workspace"],
};
