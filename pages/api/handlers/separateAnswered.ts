import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";



export default async function separateAnswered(req: NextApiRequest, res: NextApiResponse){
   const {userId, questionsArray} = req.query;

   let answered: string[] = [];
   let unanswered: string[] = [];
   //@ts-ignore
   for (const questionId of JSON.parse(questionsArray)) {
    const recension = await prisma.recension.findUnique({
      where: {
        postId_userId: {
          //@ts-ignore
          userId,
          //@ts-ignore
          postId: questionId.id,
        },
      },
    });

    if (recension) {
      answered.push(questionId);
    } else {
      unanswered.push(questionId);
    }
  }

  return res.status(200).json({answered, unanswered});
}