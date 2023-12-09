import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";

export default async function getExams(req:NextApiRequest, res:NextApiResponse){

       try {
           const results = await prisma.exam.findMany({
               select:{
                id:true,
                title:true,
                offeredAnswers:true,
               },
               orderBy:{
                createdAt:'desc'
               },
           })

           if(results) return res.json(results);
       } catch (error) {
           return res.status(500).json({message:'Something went wrong...'});
       }
}