import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";


export default async function getNotes(req:NextApiRequest, res:NextApiResponse){
        const {examId} = req.query;
        
        try {
            const results = await prisma.note.findMany({    
                select:{
                    postName:true,
                    userEmail:true,
                    text:true,
                },
                where:{
                    examId:String(examId),
                },
                orderBy:{
                    currentPost:'asc'
                }
             })

             return res.json(results);
        } catch (error) {
            return res.status(500).json({message:'Error!'});
        }
}