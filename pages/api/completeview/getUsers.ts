import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";

export default async function getUsers(req:NextApiRequest, res:NextApiResponse){
    const {examId} = req.query;
     try {
        const records = await prisma.user.findMany({
               /* where:{
                    exams:{
                        some:{
                            id:String(examId)
                        }
                    }
                }*/
        })
        return res.json(records);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
}