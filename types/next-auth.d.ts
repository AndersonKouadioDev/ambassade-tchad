import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      token: string;
      role: string;
      // otpRequired?: boolean;    // ajout OTP
      // otpToken?: string | null; // ajout OTP
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    token: string;
    role: string;
    // otpRequired?: boolean;    // ajout OTP
    // otpToken?: string | null; // ajout OTP
  }

  interface JWT {
    id: string;
    name: string;
    email: string;
    image?: string;
    token: string;
    role: string;
    // otpRequired?: boolean;    // ajout OTP
    // otpToken?: string | null; // ajout OTP
  }
}
