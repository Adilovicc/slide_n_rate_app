import React, {useState,useRef,useEffect} from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import {StarIcon} from '@heroicons/react/24/outline'
import { Type } from 'typescript'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {useRouter} from 'next/router'
import Swal from 'sweetalert2'



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
            updatedStarsColors[i as keyof typeof starColor]='fill-yellow-400';     
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
        return alert("Moras unijeti zvijezdu");
      }
       axios({
         url:'https://slide-n-rate-project.vercel.app/api/handlers/addRecension',
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
       <form onSubmit={handleSubmit(reviewPost)} className="relative bg-slate-50 w-[80%] lg:w-[70%] flex items-center justify-center flex-col py-10">
           <XMarkIcon className="absolute top-2 right-2 h-8" onClick={()=>{props.setOpen(false)}}></XMarkIcon>
           <div className="mb-4">
             <div className="flex">
             {stars.map((star)=>(
                <StarIcon key={star} className={`h-10 ${starColor[star as keyof typeof starColor]}`} onMouseEnter={()=>starsChangeColors(star)}/>
             ))}
             </div>
            {/* <input value={gradeInputValue} readOnly {...register("grade",{pattern:{value:/^[1-9]\d*$/, message:"Moraš odabrati ocjenu (zvijezde 1-5)"}})}/> */}
             {errors.grade && <p className="text-red-800">You must select grade!</p>}
           </div>
           <span className="font-serif font-bold text-[25px]">
                            {gradeInputValue == 1 ?
                            <div>Sinus</div> : gradeInputValue == 2 ?
                            <div>Afib</div> : gradeInputValue == 3 ?
                            <div>AFL</div> : gradeInputValue == 4 ?
                            <div>Other</div> : gradeInputValue == 5 ?
                            <div>Poor record quality</div> : ''}
                         </span>
           <div className="flex items-center justify-between">
             <button className="bg-blue-500 mt-5 hover:bg-blue-700 text-white font-bold
              py-2 px-10 rounded focus:outline-none focus:shadow-outline" type="submit">
                Publish
             </button>
           </div>
       </form>
  )
}

