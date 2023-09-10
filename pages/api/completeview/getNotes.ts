import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";

export default async function getRecensions(req:NextApiRequest, res:NextApiResponse){
     const {examId} = req.query;
     try {
        const records = await prisma.note.findMany({
            where:{
              examId:String(examId)
            },
           select:{
              text:true,
              postId:true,
              userId:true,
           }
        })
        return res.json(records);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
}