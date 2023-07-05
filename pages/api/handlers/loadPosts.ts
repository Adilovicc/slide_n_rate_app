import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";

export default async function LoadPosts(req:NextApiRequest, res:NextApiResponse){
     const {startAt,take, examId} = req.query;
     
     try {
        const records = await prisma.post.findMany({
            where:{
                examId:String(examId)
            },
            skip: Number(startAt),
            take: Number(take)
        })
        return res.json(records);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
}