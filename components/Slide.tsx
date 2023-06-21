import Details from "./Details";
import Image from "next/image";
import { useState, useRef } from "react";
import ReviewForm from "./ReviewForm";
import { userAgent } from "next/server";
import { TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Swal from "sweetalert2";
import {useRouter} from "next/router";
import {baseUrl} from '../baseUrl'
import {Document, Page, pdfjs} from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Slide(props:{post:any, currentPost:number, user:any, userId:string}){
    const [showReviewScr, setShowRevScr] = useState(false);
    const [deletePost,setDeletePost] = useState(false);
    const router = useRouter();
    const handleDeletePost =()=>{
       setDeletePost(prevPost=>!prevPost);
    }
    const processDelete =()=>{
        axios({
            url:baseUrl+'api/handlers/deletePost',
            data:{
                postId:props.post.id
             },
             method:'POST'
           }).then((response)=>{
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Post deleted!',
                showConfirmButton: false,
                timer: 2500
              });
              setDeletePost(false);
              router.reload();
             }
           ).catch((err)=>{
             setDeletePost(false);
             Swal.fire({
                position: 'bottom-right',
                icon: 'error',
                title: 'Error',
                showConfirmButton: false,
                timer: 2500
             }).then(router.reload); ;  
         })
        
    }

    return(
      <div style={{transform:`translateX(-${props.currentPost*100}%)`}} 
        className={`relative w-full max-w-[1200px]  transition-transform duration-1000 ease-out h-[540px] flex-shrink-0 `}>
            {props.user.role == 'admin' && 
            <div onClick={()=>handleDeletePost()} className="absolute top-5 right-5 h-10 w-10 rounded-full bg-[rgba(244,238,238,0.8)] border-[1px] border-black z-10 flex justify-center items-center">
                <TrashIcon className=" h-6 w-6 cursor-pointer"></TrashIcon>
            </div>}
           <div className={`relative w-full flex flex-col items-center h-full bg-black/30`}>
               {props.post.type=='pdf' ?
                //<iframe className="w-full h-full"  src={`${props.post.fileUrl}`}></iframe> 
                <div className="w-full h-full flex flex-col items-center overflow-y-auto">
                <Document  file={`${props.post.fileUrl}`}>
                <Page className={'scale-[1.15]'} pageNumber={1} />
                </Document>
                </div>
                : 
                <Image fill src={`${props.post.fileUrl}`} alt='post_img'></Image>}
           </div>
           <Details userId={props.userId} user={props.user} post={props.post} setOpen={setShowRevScr}></Details>
           <div className={`${showReviewScr ? 'fixed' : 'hidden'} flex justify-center items-center top-0 right-0 left-0 bottom-0 z-50 backdrop-blur-md`}>
             <ReviewForm userId={props.userId} postId={props.post.id} setOpen={setShowRevScr}></ReviewForm>
          </div>
          <div className={`${deletePost ? 'fixed' : 'hidden'} flex justify-center items-center top-0 right-0 left-0 bottom-0 z-50 backdrop-blur-md`}>
             <div className="h-[30%] w-[80%] min-h-[40px] min-w-[140px] flex items-center justify-center">
             <div className="p-2 w-[50%] max-w-[300px]">
                <button onClick={()=>{processDelete()}} className="w-[90%] px-3 py-2 font-semibold rounded-lg border-[1px] border-white bg-red-600 mt-5 hover:bg-red-700 text-white">DELETE</button>
             </div>
             <div className="p-2 w-[50%] max-w-[300px]">
                <button onClick={()=>handleDeletePost()} className="w-[90%] px-3 py-2 font-semibold rounded-lg border-[1px] border-white bg-blue-500 mt-5 hover:bg-blue-700 text-white">CANCEL</button>
             </div>
             </div>
          </div>
      </div>
    )
}