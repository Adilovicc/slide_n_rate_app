import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
    description: string,
    creator: string, 
    participants: number, 
    posts: number,
    offeredAnswers: string[]
}

export default function BasicAccordion({description, creator, participants, posts, offeredAnswers}:Props) {
  return (
    <div className="w-full">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className="font-bold">Description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {description}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className="font-bold">Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="flex"><div className="pr-3">Creator:</div>{creator}</div>
            <div className="flex"><div className="pr-3">Number of qestions:</div>{posts}</div>
            <div className="flex"><div className="pr-3">Number of participants:</div>{participants}</div>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className="font-bold">Offered answers</Typography>
        </AccordionSummary>
        <AccordionDetails >
          <Typography >
           {offeredAnswers.map((answer:string, idx:number)=>(
              <div key={idx} className="my-1 flex space-x-2 items-center">
                <div className="w-8 h-8 rounded-xl min-w-[32px] bg-[#3F72AF] flex items-center justify-center
               font-semibold text-white">{idx+1}</div>
                 <div className='truncate'>{answer}</div>
               </div>
           ))}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}