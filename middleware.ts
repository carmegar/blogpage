import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    console.log("Middleware executed for:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }

        if (pathname.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/admin/:path*"],
};
