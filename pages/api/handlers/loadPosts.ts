import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";

export default async function LoadPosts(req:NextApiRequest, res:NextApiResponse){
     const { examId, array} = req.query;
     const array1 = JSON.parse(String(array));
     try {
        const records = await prisma.post.findMany({
            where:{
                AND:[
                 {
                 examId:String(examId)
                 },
                 {
                   OR:[
                    {
                        //@ts-ignore
                        id: String(array1[0]),
                    } ,
                    {
                        //@ts-ignore
                        id: String(array1[1]),
                    } ,
                    {
                        //@ts-ignore
                        id: String(array1[2]),
                    } 
                   ]
                 }
                ]
            },
            include:{
                exam:{
                    select:{
                        offeredAnswers:true
                    }
                }
            }, 
        })

        
        return res.json(records);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
}