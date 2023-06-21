import React, {useState,useRef,useEffect} from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import {StarIcon} from '@heroicons/react/24/outline'
import { Type } from 'typescript'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {useRouter} from 'next/router'
import Swal from 'sweetalert2'
import {baseUrl} from '../baseUrl'



export default function ReviewForm(props:{userId:any, postId:string, setOpen:(value:boolean)=>void}) {
  const gradeInput = useRef(null);
  const stars = [1,2,3,4,5];
  const {register, setValue, handleSubmit, formState:{errors}} = useForm();


  const [starColor, setStarColor] = useState({1:'',2:'',3:'',4:'',5:''});
  const [gradeInputValue, setGradeInputValue] = useState(0);
  const [commentInputValue, setCommentInputValue] = useState('');
  const router = useRouter();

  const starsChangeColors = (broj:number) =>{
    let updatedStarsColors = {...starColor};
    for(var i=1; i<6; i++){
        if(i==broj){
            updatedStarsColors[i as keyof typeof starColor]='bg-black/90';     
        }
        if(i!=broj){
            updatedStarsColors[i as keyof typeof starColor]='';          
        }
     }
     setGradeInputValue(broj);
     setValue('grade',gradeInputValue)
     setStarColor(updatedStarsColors);
  }
  
  const reviewPost = () =>{
      if(gradeInputValue<1 || gradeInputValue>5){
        return alert("You have to select the answer");
      }
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
         return Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your answer has been submitted!',
            showConfirmButton: false,
            timer: 2500
          });
         }
       ).catch((err)=>{
         console.log(err.response.data.message);
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
       <form onSubmit={handleSubmit(reviewPost)} className="relative bg-slate-50 w-[80%] lg:w-[70%] border-[0.5px] border-black/30 flex items-center justify-center flex-col py-10">
           <XMarkIcon className="absolute top-2 right-2 h-8" onClick={()=>{props.setOpen(false)}}></XMarkIcon>
           <div className="mb-4">
             <div className="flex flex-col items-center justify-center">
             {stars.map((star,i)=>(
                <div key={i} className="flex items-center w-[100%] max-w-[300px] justify-start">
                  <div className='p-1'><div key={star} className={`h-10 w-10 cursor-pointer border-[2px] border-black ${starColor[star as keyof typeof starColor]}`} onClick={()=>starsChangeColors(star)}></div></div>
                  <div className='font-semibold text-[18px]'>
                  {i == 0 ?
                            <div>Sinus</div> : i == 1 ?
                            <div>Afib</div> : i == 2 ?
                            <div>AFL</div> : i == 3 ?
                            <div>Other</div> : 
                            <div>Poor record quality</div> }
                  </div>
                </div>
             ))}
             </div>
            {/* <input value={gradeInputValue} readOnly {...register("grade",{pattern:{value:/^[1-9]\d*$/, message:"Moraš odabrati ocjenu (zvijezde 1-5)"}})}/> */}
             {errors.grade && <p className="text-red-800">You must select grade!</p>}
           </div>

           <div className="flex items-center justify-between">
             <button className="bg-blue-500 mt-5 hover:bg-blue-700 text-white font-bold
              py-2 px-10 rounded focus:outline-none focus:shadow-outline" type="submit">
                Publish
             </button>
           </div>
       </form>
  )
}

