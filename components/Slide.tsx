import Details from "./Details";
import Image from "next/image";
import { useState } from "react";
import ReviewForm from "./ReviewForm";

export default function Slide(props:{post:any, currentPost:number, userId:string}){
    const [showReviewScr, setShowRevScr] = useState(false);
    return(
        <div style={{transform:`translateX(-${props.currentPost*100}%)`}} 
             className={`relative w-full max-w-[512px]  transition-transform duration-1000 ease-out h-[500px] flex-shrink-0 `}>
                <div className="relative w-full h-full bg-black/30">
                    <Image fill src={`${props.post.fileUrl}`} alt='post_img'></Image>
                </div>
                <Details userId={props.userId} post={props.post} setOpen={setShowRevScr}></Details>
                <div className={`${showReviewScr ? 'fixed' : 'hidden'} flex justify-center items-center top-0 right-0 left-0 bottom-0 z-50 backdrop-blur-md`}>
                  <ReviewForm userId={props.userId} postId={props.post.id} setOpen={setShowRevScr} ></ReviewForm>
               </div>
        </div>
    )
}