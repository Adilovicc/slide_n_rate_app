import Details from "./Details";
import Image from "next/image";
import { useState, useRef, useLayoutEffect,useEffect } from "react";
import ReviewForm from "./ReviewForm";
import { userAgent } from "next/server";
import { TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Swal from "sweetalert2";
import {useRouter} from "next/router";
import {baseUrl} from '../baseUrl'
import {Document, Page, pdfjs} from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Slide(props:{post:any, currentPost:number, user:any, userId:string, setCurrent:()=>void}){
    const [showReviewScr, setShowRevScr] = useState(false);
    const [deletePost,setDeletePost] = useState(false);
    const pageWidthRef = useRef(null);
    const screenHeightRef = useState(null);
    const [isOpen, setOpen] = useState(false);
    const router = useRouter();
    const [maxWidth, setMaxWidth] = useState(Math.round(window.innerHeight*1.62));
    const [pageWidth, setPageWidth] = useState(600);
    const [screenHeight, setScreenHeight] = useState(1000);

    const [checker, setChecker] = useState(false);

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

    useLayoutEffect(() => {
      //@ts-ignore
      setPageWidth(pageWidthRef.current.offsetWidth-pageWidthRef.current.offsetWidth*0.14-128);
      const resizeHandler = ()=>{
         setMaxWidth(Math.round(window.innerHeight*1.6));
         //@ts-ignore
         setPageWidth(pageWidthRef.current.offsetWidth-pageWidthRef.current.offsetWidth*0.14-128);
      }
      addEventListener('resize', resizeHandler);
      return()=>removeEventListener('resize', resizeHandler);
    }, [maxWidth]);

    useLayoutEffect(() => {
     
      const resizeHandler = ()=>{
         setMaxWidth(Math.round(window.innerHeight*1.6));
         //@ts-ignore
      }
      addEventListener('resize', resizeHandler);
      return()=>removeEventListener('resize', resizeHandler);
    }, []);

    return(
      <div style={{transform:`translateX(-${props.currentPost*100}%)`}} 
        className={`relative w-full transition-transform overflow-hidden flex justify-center overflow-x-auto duration-1000 ease-out h-full bg-black/50 flex-shrink-0 `}>
            {props.user.role == 'admin' && 
            <div onClick={()=>handleDeletePost()} className="absolute top-5 right-5 h-10 w-10 rounded-full bg-[rgba(244,238,238,0.8)] border-[1px] border-black z-10 flex justify-center items-center">
                <TrashIcon className=" h-6 w-6 cursor-pointer"></TrashIcon>
            </div>}
           <div  style={{maxWidth:`${maxWidth}px`}} ref={pageWidthRef} className={`relative w-full flex items-center h-full  ${props.post.type=='pdf' ? 'px-16' : ''}`}>
               {props.post.type=='pdf' ?  <div className="h-full w-[86%] overflow-hidden overflow-x-auto">
                 <Document className="w-full h-full" file={props.post.fileUrl}>
                  <Page width={pageWidth} className="h-full overflow-hidden overflow-y-auto" pageNumber={1}></Page>
                 </Document>
               </div>
              
             
            
                : 
                <div className="h-full w-[86%] relative"><Image fill src={`${props.post.fileUrl}`} alt='post_img'></Image></div>
                }
                <div className="grow h-full">
                  <ReviewForm userId={props.userId} postId={props.post.id} setOpen={setOpen} setCurrent={props.setCurrent}></ReviewForm>
                </div>
           </div>
           {props.user.role == 'admin' && <Details userId={props.userId} user={props.user} post={props.post} setOpen={setShowRevScr}></Details>}
           <div className={`${showReviewScr ? 'fixed' : 'hidden'} flex justify-center items-center top-0 right-0 left-0 bottom-0 z-50 backdrop-blur-md`}>
            
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