import NextAuth, { Session } from "next-auth";

import { NextApiHandler } from "next";
import GoogleProvider from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

interface User {
  id: string;
  email: string;
  name: string;
}

interface Account {
  provider: string;
  type: string;
  id: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
}

interface Profile {
  sub: string;
  email: string;
  name: string;
}

interface Guest {
  id: string;
  email: string;
  fullName: string;
}

interface ExtendedSession extends Session {
  user: {
    email: string;
    name: string;
    guestId?: string;
  };
}

const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    authorized({ auth, request }: { auth: any; request: any }): boolean {
      return !!auth?.user;
    },
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account: Account;
      profile: Profile;
    }): Promise<boolean> {
      try {
        const existingGuest: Guest | null = await getGuest(user.email);

        if (!existingGuest) {
          // @ts-ignore
          await createGuest({ email: user.email, name: user.name });
        }

        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },
    // @ts-ignore
    async session({ session, user }): Promise<ExtendedSession> {
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;
      return session as ExtendedSession;
    },
  },
  pages: {
    signIn: "/login",
  },
};

// @ts-ignore
export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
}: {
  auth: NextApiHandler;
  signIn: NextApiHandler;
  signOut: NextApiHandler;
  handlers: {
    GET: NextApiHandler;
    POST: NextApiHandler;
  };
  // @ts-ignore
} = NextAuth(authConfig);

// import NextAuth, { Session } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { createGuest, getGuest } from "./data-service";
// import { NextRequest } from "next/server";

// // Define User, Account, Profile, and Guest interfaces
// interface User {
//   id: string;
//   email: string;
//   name: string;
// }

// interface Account {
//   provider: string;
//   type: string;
//   id: string;
//   refresh_token?: string;
//   access_token?: string;
//   expires_at?: number;
// }

// interface Profile {
//   sub: string;
//   email: string;
//   name: string;
// }

// interface Guest {
//   id: string;
//   email: string;
//   fullName: string;
// }

// export default interface ExtendedSession extends Session {
//   user: {
//     email: string;
//     name: string;
//     guestId: string;
//   };
// }

// // Define the NextAuth configuration
// const authConfig = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.AUTH_GOOGLE_ID as string,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
//     }),
//   ],
//   callbacks: {
//     async signIn({
//       user,
//       account,
//       profile,
//     }: {
//       user: User;
//       account: Account;
//       profile: Profile;
//     }): Promise<boolean> {
//       try {
//         const existingGuest: Guest | null = await getGuest(user.email);

//         if (!existingGuest) {
//           // @ts-ignore
//           await createGuest({ email: user.email, fullName: user.name });
//         }

//         return true;
//       } catch (error) {
//         console.error("Sign-in error:", error);
//         return false;
//       }
//     },
//     async session({
//       session,
//     }: {
//       session: ExtendedSession;
//     }): Promise<ExtendedSession> {
//       const guest = await getGuest(session.user.email);
//       session.user.guestId = guest.id;
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login",
//   },
// };

// // Initialize NextAuth with the configuration
// // @ts-ignore
// const nextAuthInstance = NextAuth(authConfig);

// // Export handlers (GET, POST) and auth
// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = nextAuthInstance;
