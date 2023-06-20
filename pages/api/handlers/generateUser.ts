import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";
import { v4 } from "uuid";




export default async function generateUser(req:NextApiRequest, res:NextApiResponse){
    const {username,emailBase} = req.query;
    let password = 'Pass'+v4().replace(/-/g, '');
    password=password.substring(0,10);
    const email = emailBase + v4().replace(/-/g, '').substring(0,4) + '@user.net';
    try {
       const records = await prisma.user.create({
           data:{
            email:email,
            password:password,
            name:String(username)
           }
       })
       return res.json(records);
   } catch (error) {
       return res.status(500).json({ message: 'An error occurred' });
   }

}