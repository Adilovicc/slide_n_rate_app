import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";


export default async function removeParticipant(req:NextApiRequest,res:NextApiResponse){
      const {id, examId} = req.body;
      try {
          const record = await prisma.userExam.delete({
            where:{
                id:id
            }
          })
           if(record) await prisma.exam.update({
                 data:{
                    membersTotal:{
                        decrement:1
                    }
                 },
                 where:{
                    id:String(examId)
                 }
           })
          if(record) return res.status(200).json({message:'Deleted!'})
      } catch (error) {
          return res.status(500);
      }
}