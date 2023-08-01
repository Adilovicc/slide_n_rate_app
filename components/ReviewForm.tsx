import React, {useState,useRef,useEffect} from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import {StarIcon, PencilSquareIcon} from '@heroicons/react/24/outline'
import { Type } from 'typescript'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {useRouter} from 'next/router'
import Swal from 'sweetalert2'
import {baseUrl} from '../baseUrl'
import spinner from '../public/spinner.svg'
import Image from 'next/image'



export default function ReviewForm(props:{userId:any, offeredAnswers:any, postId:string, setOpen:(value:boolean)=>void, setCurrent:()=>void, handleOpenComplaintForm:()=>void}) {
  const gradeInput = useRef(null);
  const stars = [1,2,3,4,5];
  const {register, setValue, handleSubmit, formState:{errors}} = useForm();
  const [answered,setAnswered] = useState(false);
  const [myAnswer, setMyAnswer] = useState<number[]>([]);
  const [loading,setLoading] = useState(true);
  

  const [gradeInputValue, setGradeInputValue] = useState<number[]>([]);
  const [commentInputValue, setCommentInputValue] = useState('');
  const router = useRouter();

  const [currentAnswerIndex, setCrtAnsIdx] = useState<number[]>([]);


  const starsChangeColors = (broj:number) =>{
    
     if(gradeInputValue.includes(broj)){
        let temp = gradeInputValue.filter(n=>n!==broj);
        setGradeInputValue(temp);
        let tempN = currentAnswerIndex.filter(n=>n!==broj-1);
        setCrtAnsIdx(tempN);
     }
     else{
        setGradeInputValue(prevValue=>[...prevValue,broj]);
        setCrtAnsIdx(prevValue=>[...prevValue,broj-1]);
     }
  }
  

  const [trigger, setTrigger] = useState(false);

  useEffect(()=>{
    let cancel: () => void = () => {};
    setLoading(true);
    try {
      axios({
        method:'GET',
        url: baseUrl+'api/handlers/findMyComment',
        params: {
            postId: props.postId,
            userId: props.userId
        },
        cancelToken: new axios.CancelToken(c=>cancel=c)
      }).then(res => {
        if(!res.data){ setAnswered(false);}
        else{ setMyAnswer(res.data[0].grade); setAnswered(true);};
        setLoading(false)
      }).catch(
        err=> {
            if(axios.isCancel(err)) return
        }
      )
      
    } catch (error) {
     
    }
  
 return ()=> cancel(); 
},[trigger])
  
  const reviewPost = () =>{
      if(gradeInputValue.length<1){
        return alert("You have to select the answer");
      }
       setLoading(true);
       axios({
         url:baseUrl+'api/handlers/addRecension',
         data:{
            grade: gradeInputValue,  
            userId: props.userId,
            postId: props.postId,
         },
         method:'POST'
       }).then((response)=>{
         props.setOpen(false);
         setTrigger(prevTrig => !prevTrig);
         props.setCurrent();
         return Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your answer has been submitted!',
            showConfirmButton: false,
            timer: 2000
          });
         }
       ).catch((err)=>{
         props.setOpen(false);
         return Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Oops...',
            text: err.response.data.message,
            timer:2500
          })
       })
   }
  

  


  return (
       <div className="relative h-full bg-slate-50 max-w-[200px] w-[100%] pb-10 pt-10 border-[0.5px] border-black/30 flex items-center justify-center flex-col">
          {/*XMarkIcon className="absolute top-2 right-2 h-8" onClick={()=>{props.setOpen(false)}}></XMarkIcon>*/}
          <PencilSquareIcon onClick={()=>props.handleOpenComplaintForm()} className="absolute top-0 w-8 h-8 z-20"></PencilSquareIcon>
       {
        
       (!answered && !loading) ?
       <form onSubmit={handleSubmit(reviewPost)} className="relative w-full h-full flex items-center justify-center flex-col ">
           <div className="mb-4 overflow-auto ">
             <div className="flex flex-col items-center justify-center">
             {props.offeredAnswers.map((answer:any,i:number)=>(
                <div key={i} className="flex flex-col items-center w-[100%] max-w-[300px] justify-start mb-2">
                  <div className='p-1'>
                    <div key={answer} className={`h-8 w-8  cursor-pointer border-[2px]
                   border-black ${currentAnswerIndex.includes(i) ? 'bg-black/90' : ''} `} onClick={()=>starsChangeColors(i+1)}></div>
                   </div>
                  <div className='font-semibold text-[18px]'>
                  {answer}
                  </div>
                </div>
             ))}
             </div>
            {/* <input value={gradeInputValue} readOnly {...register("grade",{pattern:{value:/^[1-9]\d*$/, message:"Moraš odabrati ocjenu (zvijezde 1-5)"}})}/> */}
             {errors.grade && <p className="text-red-800">You must select grade!</p>}
           </div>

           <div className="flex items-center justify-between">
             <button className="bg-blue-500 mt-5 hover:bg-blue-700 text-white font-bold
              py-2 px-10 mx-1 rounded focus:outline-none focus:shadow-outline" type="submit">
                Next
             </button>
           </div>
       </form> : (answered && !loading) ? 
       <div>
              <div className='font-bold flex flex-col justify-center items-center text-[18px]'>
                   <span className="font-normal">Your answer:</span>
                   {myAnswer.map((obj,idx)=>(
                      <div key={idx}>-{props.offeredAnswers[obj-1]}</div>
                   ))}
                
              </div>
          </div> :
        <div className="w-14 h-14 relative"><Image className="animate-spin" fill src={spinner} alt='spinner-img'></Image></div>
       }
       </div>
  )
}

