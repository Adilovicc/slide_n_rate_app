import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";


export default async function getExams(req:NextApiRequest,res:NextApiResponse){
    const { archive } = req.query;

    try {
        if (archive && archive == 'true') {
            const exams = await prisma.exam.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    creator: true
                },
                where: {
                    archived: true
                }
            });
            if (exams) return res.json(exams);
        }
        else {
            const exams = await prisma.exam.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    creator: true
                },
                where: { OR: [{ archived: false }, { archived: null }] }
            });
            if (exams) return res.json(exams);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error' });
    }
}