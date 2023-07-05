import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";


export default async function create(req:NextApiRequest, res:NextApiResponse){
       const {values} = req.query;
       //@ts-ignore
       const valuesE = JSON.parse(values);
       const {title, answerList, createdBy} = valuesE;
       console.log(title);
       console.log(answerList);
       console.log(createdBy);
       try {
            const record = await prisma.exam.create({
                data:{
                    createdBy:createdBy,
                    offeredAnswers:answerList,
                    title,
                },
                include:{
                    creator:true
                }
            })

            if(record) return res.json(record);
       } catch (error) {
             console.log(error);
             return res.status(500).json({message:'Error'});
       }
     
}