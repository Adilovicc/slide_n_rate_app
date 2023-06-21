import Image from "next/image"

export default function Comment(props:{review:any}){
     return(
               <section className="lazyLoading flex items-center mb-3">
                    <div className={`relative w-10 h-10 rounded-full bg-[rgba(18,18,18,0.1)]`}>
                         {props.review.ratedBy.image ? <Image className="rounded-full" src={props.review.ratedBy.image} fill alt='usrImg'></Image> : ''}
                    </div>
                    <div className="ml-2 p-2 rounded-md border-md flex flex-col justify-center">
                         <span className="font-serif font-semibold">
                            {props.review.ratedBy.name ? props.review.ratedBy.name : props.review.ratedBy.email}
                         </span>
                         <span className="font-serif">
                              
                            {props.review.grade == 1 ?
                            <div>Sinus</div> : props.review.grade == 2 ?
                            <div>Afib</div> : props.review.grade == 3 ?
                            <div>AFL</div> : props.review.grade == 4 ?
                            <div>Other</div> : 
                            <div>Poor record quality!</div>}
                         </span>
                     </div>
               </section>
     )
}
