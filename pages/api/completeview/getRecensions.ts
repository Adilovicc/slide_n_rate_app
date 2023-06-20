import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";

export default async function getRecensions(req:NextApiRequest, res:NextApiResponse){
     try {
        const records = await prisma.recension.findMany({

        })
        return res.json(records);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
}


