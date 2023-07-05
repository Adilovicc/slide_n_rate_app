import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";


export default async function getExams(req:NextApiRequest,res:NextApiResponse){
        try {
            const exams = await prisma.exam.findMany({
                orderBy:{
                    createdAt:'desc'
                },
                include:{
                    creator:true
                }
            });

            if(exams) return res.json(exams);
        } catch (error) {
            return res.status(500).json({message:'Error'});
        }
}