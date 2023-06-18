import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";

export default async function LoadRecesnsions(req:NextApiRequest, res:NextApiResponse){
     const {startAt, postId} = req.query;
     
     try {
        const records = await prisma.recension.findMany({
            where:{
                postId:String(postId)
            },
            include:{
                ratedBy:true
            },
            skip: Number(startAt),
            take: 3
        })
        return res.json(records);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
}