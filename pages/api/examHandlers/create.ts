import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";


export default async function create(req:NextApiRequest, res:NextApiResponse){
       const {values} = req.query;
       //@ts-ignore
       const valuesE = JSON.parse(values);
       const {title, answerList, createdBy, multipleSelection, examDescription} = valuesE;
      
       try {
            const record = await prisma.exam.create({
                data:{
                    createdBy:createdBy,
                    offeredAnswers:answerList,
                    title,
                    multipleSelection: multipleSelection,
                    description: examDescription
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