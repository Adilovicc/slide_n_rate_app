import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prisma from "../../../lib/prismadb";





export default async function findMyComment(req:NextApiRequest, res:NextApiResponse){
    const {postId, userId} = req.query;
    try {
        const records = await prisma.recension.findFirst({
            where:{
                  postId:String(postId),
                  userId:String(userId) 
            }
        })
        if (records === null) return res.json(records);
              return res.json([records]);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }

}