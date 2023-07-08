import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";

export default async function getPosts(req:NextApiRequest, res:NextApiResponse){
     const {examId} = req.query;
     console.log("OOVDJEEE SMOOOO!!!!");
     
     try {
        const records = await prisma.post.findMany({
                where:{
                  examId:String(examId)
                },
                orderBy:{
                    createdAt:'asc'
                }
        })
        return res.json(records);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
}