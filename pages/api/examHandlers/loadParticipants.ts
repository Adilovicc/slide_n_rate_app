import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";
import { contains } from "jquery";


export default async function loadParticipants(req:NextApiRequest, res:NextApiResponse){
      const {examId, skip, take, query} = req.query;
      
      try {
        const records = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                userExam: {
                  select: {
                    id: true,
                  },
                  where: {
                    examId: String(examId),
                  },
                },
              },
              where:{
                email: {
                    contains:String(query)
                }
              },
              skip:Number(skip),
              take:Number(take),
        });
     
        return res.json(records);
      } catch (error) {
        return res.status(500).json({message:'Stg went wrong!'});
      }
}