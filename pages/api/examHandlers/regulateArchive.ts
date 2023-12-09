import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";

export default async function regulateArchive(req:NextApiRequest, res:NextApiResponse){
      const {archive, examId} = req.body;
      if(archive){
        try {
            const result = await prisma.exam.update({
                where:{
                    id:String(examId),
                },
                data:{
                    archived: true,
                }
            })

            return res.status(200).json({message:'Exam archived successfully'});
        } catch (error) {
            return res.status(500).json({message:'Something went wrong!'});
        }
      }
     else{
        try {
            const result = await prisma.exam.update({
                where:{
                    id:String(examId),
                },
                data:{
                    archived: false,
                }
            })

            return res.status(200).json({message:'Exam activated successfully'});
        } catch (error) {
            return res.status(500).json({message:'Something went wrong!'});
        }
     }
}