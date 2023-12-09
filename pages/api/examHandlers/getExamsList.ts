import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";

export default async function getExamsList(req:NextApiRequest, res:NextApiResponse){
       try {
           const results = await prisma.exam.findMany({
               select:{
                id:true,
                title:true,
               },
               where:{
                OR: [{ archived: false }, { archived: null }] 
               },
               orderBy:{
                createdAt:'desc'
               }
           })

           if(results) return res.json(results);
       } catch (error) {
           return res.status(500).json({message:'Something went wrong...'});
       }
}