import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: (params) => {
      let { token } = params;
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/chat/:path*",
    "/private",
    "/api/sessions/:path*",
    "/api/message/:path*",
  ],
};
