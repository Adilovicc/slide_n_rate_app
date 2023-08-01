import Image from "next/image"

export default function Comment(props:{review:any, offeredAnswers:any}){

     return(
               <section className="lazyLoading flex items-center mb-3">
                    <div className={`relative w-10 h-10 rounded-full bg-[rgba(18,18,18,0.1)]`}>
                         {props.review.ratedBy.image ? <Image className="rounded-full" src={props.review.ratedBy.image} fill alt='usrImg'></Image> : ''}
                    </div>
                    <div className="ml-2 p-2 bg-black/10 pr-10 rounded-md border-md flex flex-col justify-center">
                         <span className="font-serif font-semibold">
                            {props.review.ratedBy.name ? props.review.ratedBy.name : props.review.ratedBy.email}
                         </span>
                         
                             {props.review.grade.map((itm:number, idx:number)=>(
                                <div key={idx} className="font-serif z-40 text-black">{props.offeredAnswers[itm-1]}</div>
                             ))}
                       
                         
                     </div>
               </section>
     )
}
