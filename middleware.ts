// import { NextResponse } from "next/server";

// export function middleware(request: Request) {
//   console.log("middleware", request);

//   return NextResponse.redirect(new URL("/about", request.url)); // infinite loop
// }

// export const config = {
//   matcher: ["/account", "/cabins"],
// };

import { auth } from "@/app/_lib/auth";

export const middleware = auth;

export const config = {
  matcher: ["/account"],
};
