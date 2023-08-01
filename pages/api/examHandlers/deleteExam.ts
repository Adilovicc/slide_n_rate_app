import prisma from "@/lib/prismadb";
import { NextApiRequest, NextApiResponse } from "next";




export default async function deleteExam(req: NextApiRequest, res:NextApiResponse){
        const {examId} = req.body;
  

        try {
             const result = await prisma.exam.delete({
                where: {
                    id:examId,
                }
             })

             if(result) return res.status(200).json({message:"Success"});
        } catch (error) {
             return res.status(200).json({message:"Error"});
        }

}