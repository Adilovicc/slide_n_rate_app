import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prismadb";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";


export default NextAuth({
  adapter: PrismaAdapter(prisma),
  session:{
    strategy:"jwt",
  },
  secret: process.env.JWT_SECRET,
  providers:  [
    CredentialsProvider({
        type:"credentials",
        name:"Credentials",
        credentials: {
         email: { label: "Email", type: "text", placeholder: "Email" },
         password: { label: "Password", type: "text", placeholder: "Password" },
       },
        async authorize(credentials, req){
             const result = await prisma.user.findUnique({
               where:{
                 email:credentials?.email
               }
             });
             if(!result) throw new Error("No user matches with that email!");
             //@ts-ignore
             if(!result.password || result.password==="") throw new Error("Try to login with email");
             //@ts-ignore
             if(result.password !== credentials?.password) throw new Error("Incorrect password");
 
             return result;
        }, 
     }),
 ]

});