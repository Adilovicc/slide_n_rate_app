import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";


export default async function create(req:NextApiRequest, res:NextApiResponse){
       const {values} = req.query;
       //@ts-ignore
       const valuesE = JSON.parse(values);
       const {title, answerList, createdBy, multipleSelection, examDescription} = valuesE;
       const colors = [
        'bg-[#222831]',
        'bg-[#750E21]',
        'bg-[#E3651D]',
        'bg-[#04364A]',
        'bg-[#132043]',
        'bg-[#004225]',
       ]
       const number = Math.floor(Math.random()*6);

       try {
            const record = await prisma.exam.create({
                data:{
                    createdBy:createdBy,
                    offeredAnswers:answerList,
                    title,
                    multipleSelection: multipleSelection,
                    description: examDescription,
                    archived: false,
                    color: colors[number],
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