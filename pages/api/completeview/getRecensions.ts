import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";

export default async function getRecensions(req:NextApiRequest, res:NextApiResponse){
     const {examId} = req.query;
     try {
        const records = await prisma.recension.findMany({
            where:{
               forPost:{
                 exam:{
                    id: String(examId)
                 }
               }
            },
            select:{
               postId:true,
               userId:true,
               grade:true
            }
        })
        return res.json(records);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
}


