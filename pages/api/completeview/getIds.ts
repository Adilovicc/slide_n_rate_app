import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";


export default async function getIds(req:NextApiRequest, res:NextApiResponse){
      const {examId} = req.query;
    

      try {
        const results = await prisma.post.findMany({
            select:{
                id:true,
            },
            where:{
                examId:String(examId)
            },
            orderBy:{
              name: 'asc'
            }
        }
        )

        return res.json(results);
      } catch (error) {
        return res.status(500).json({message:'Error'});
      }

}