import prisma from "../../../lib/prismadb";
import { NextApiRequest, NextApiResponse } from "next";



export default async function addParticipan(req:NextApiRequest,res:NextApiResponse){
     const {examId, userId} = req.query;

     try {
        const result = await prisma.userExam.create({
            data:{
                userId:String(userId),
                examId:String(examId)
            }
        })
        if(result) await prisma.exam.update({
            data:{
               membersTotal:{
                   increment:1
               }
            },
            where:{
               id:String(examId)
            }
        })
        if(result) return res.json(result);

     } catch (error) {
        return res.status(500).json({message:'Stg went wrong'});
     }
}