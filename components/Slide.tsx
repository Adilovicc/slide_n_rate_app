import Details from "./Details";
import Image from "next/image";
import { useState, useRef, useLayoutEffect,useEffect } from "react";
import ReviewForm from "./ReviewForm";
import { userAgent } from "next/server";
import { TrashIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Swal from "sweetalert2";
import {useRouter} from "next/router";
import {baseUrl} from '../baseUrl'
import {Document, Page, pdfjs} from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Slide(props:{post:any, toAddOn:number, currentPost:number, increaseAnswered:()=>void, checkup:any, multipleSelection:boolean, user:any, userId:string, setCurrent:()=>void}){
    const [showReviewScr, setShowRevScr] = useState(false);
    const [deletePost,setDeletePost] = useState(false);
    const pageWidthRef = useRef(null);
    const screenHeightRef = useState(null);
    const [isOpen, setOpen] = useState(false);
    const router = useRouter();
    const [maxWidth, setMaxWidth] = useState(Math.round(window.innerHeight*1.62));
    const [pageWidth, setPageWidth] = useState(600);
    const [screenHeight, setScreenHeight] = useState(1000);
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    const [commentCreatingLoading, setCCL] = useState(false);

    const [checker, setChecker] = useState(false);
    
    const [commentInputValue, setCIV] = useState('');

    const handleDeletePost =()=>{
       setDeletePost(prevPost=>!prevPost);
    }
    const processDelete =()=>{
        axios({
            url:baseUrl+'api/handlers/deletePost',
            data:{
                postId:props.post.id,
                examId:props.post.examId
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

    const handleSendComment=()=>{
      if(commentInputValue.length==0) return alert('You have to write something'); 
      if(commentInputValue.length>300) return alert('Max of 300 characters allowed');
      if(commentCreatingLoading==true) return alert('commenting loading!');
      setCCL(true);
      axios({
        url:baseUrl+'api/handlers/addNote',
        method:'POST',
        data:{
          userId: props.userId,
          userEmail: props.user.email,
          currentPost: props.currentPost+1,
          postId: props.post.id,
          examId: props.post.examId,
          text: commentInputValue
        }
      }).then((res)=>{
          setShowComplaintForm(false);
          setCIV('');
          setCCL(false);
          return  Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Note handed in!',
            showConfirmButton: false,
            timer: 2000
          });
      }).catch((err)=>{
          setCCL(false);
          setShowComplaintForm(false);
          return Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Stg went wrong!',
            showConfirmButton: false,
            timer: 2000
          });
      })
    }

    const handleOpenComplaintForm = ()=>{
      setShowComplaintForm(true);
    }

    return(
      <div style={{transform:`translateX(-${(props.currentPost-props.toAddOn)*100}%)`}} 
        className={`relative w-full transition-transform overflow-hidden flex justify-center overflow-x-auto 
        duration-1000 ease-out h-full bg-black/50 flex-shrink-0 `}>

            {props.user.role == 'admin' && 
            <div onClick={()=>handleDeletePost()} className="absolute top-5 right-5 h-10 w-10 rounded-full bg-[rgba(244,238,238,0.8)] border-[1px] border-black z-10 flex justify-center items-center">
                <TrashIcon className=" h-6 w-6 cursor-pointer"></TrashIcon>
            </div>}
           <div  style={{maxWidth:`${maxWidth}px`}} ref={pageWidthRef} className={`relative w-full flex items-center h-full  ${props.post.type=='pdf' ? 'px-16' : ''}`}>
               {props.post.type=='pdf' ? 
                <div className="h-full w-[86%] relative overflow-hidden overflow-x-auto">
                  <div className={`${showComplaintForm? 'absolute' : 'hidden'} w-full z-10 h-full flex flex-col justify-center items-center bg-white/40 backdrop-blur-md`}>
                       <div className="bg-black/20 relative flex flex-col p-3">
                        <div className="w-full flex justify-end mb-2"><XMarkIcon className="w-8 h-8 cursor-pointer" onClick={()=>setShowComplaintForm(false)}></XMarkIcon></div>
                        <div className="bg-white rounded-md border-black/40 resize-none border-[0.5px]">
                        <textarea value={commentInputValue} placeholder="Type your note/complaint here..." onChange={(e)=>setCIV(e.target.value)} maxLength={300} 
                        className="w-[500px] h-[200px] resize-none p-2 outline-none bg-white rounded-md">
                             
                        </textarea>
                        <div className="text-black p-2">{commentInputValue.length}/300</div>
                        </div>
                        <button onClick={()=>handleSendComment()} className="w-[180px] h-[40px] text-white mt-2 font-bold bg-[#328ed8]">Send</button>
                       </div>
                  </div>
                 <Document className="w-full h-full" file={props.post.fileUrl}>
                  <Page width={pageWidth} className="h-full overflow-hidden overflow-y-auto" pageNumber={1}></Page>
                 </Document>
               </div>
              
             
            
                : 
                <div className="h-full w-[86%] relative">
                  <div className={`${showComplaintForm? 'absolute' : 'hidden'} w-full z-10 h-full 
                  flex flex-col justify-center items-center bg-white/40 backdrop-blur-md`}>
                     <div className="bg-[#393E46] rounded-lg relative flex flex-col p-3">
                        <div className="w-full flex justify-end mb-2"><XMarkIcon className="w-8 h-8 cursor-pointer text-white" onClick={()=>setShowComplaintForm(false)}></XMarkIcon></div>
                        <div className="bg-white rounded-md border-black/40 resize-none border-[0.5px]">
                        <textarea value={commentInputValue} placeholder="Type your note/complaint here..." onChange={(e)=>setCIV(e.target.value)} maxLength={300} 
                        className="w-[500px] h-[200px] resize-none p-2 outline-none bg-white rounded-md">
                             
                        </textarea>
                        <div className="text-black p-2">{commentInputValue.length}/300</div>
                        </div>
                        <button onClick={()=>handleSendComment()} className="w-[180px] h-[40px] text-white mt-2 font-bold bg-[#328ed8]">Send</button>
                       </div>
                  </div>
                  <Image fill src={`${props.post.fileUrl}`} alt='post_img'></Image>
                </div>
                }
                <div className="grow max-w-[14%] h-full">
                  <ReviewForm multipleSelection={props.multipleSelection} increaseAnswered={props.increaseAnswered} checkup={props.checkup} offeredAnswers={props.post.exam.offeredAnswers} userId={props.userId} 
                  postId={props.post.id} setOpen={setOpen} setCurrent={props.setCurrent} handleOpenComplaintForm={handleOpenComplaintForm}></ReviewForm>
                </div>
           </div>
           {props.user.role == 'admin' && <Details offeredAnswers={props.post.exam.offeredAnswers} userId={props.userId} user={props.user} post={props.post} setOpen={setShowRevScr}></Details>}
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