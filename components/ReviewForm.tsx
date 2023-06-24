import React, {useState,useRef,useEffect} from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import {StarIcon} from '@heroicons/react/24/outline'
import { Type } from 'typescript'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {useRouter} from 'next/router'
import Swal from 'sweetalert2'
import {baseUrl} from '../baseUrl'
import spinner from '../public/spinner.svg'
import Image from 'next/image'



export default function ReviewForm(props:{userId:any, postId:string, setOpen:(value:boolean)=>void, setCurrent:()=>void}) {
  const gradeInput = useRef(null);
  const stars = [1,2,3,4,5];
  const {register, setValue, handleSubmit, formState:{errors}} = useForm();
  const [answered,setAnswered] = useState(false);
  const [myAnswer, setMyAnswer] = useState(0);
  const [loading,setLoading] = useState(true);


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
        if(!res.data){ setAnswered(false); }
        else{ setMyAnswer(res.data[0].grade); setAnswered(true); props.setCurrent(); };
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
      if(gradeInputValue<1 || gradeInputValue>5){
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
       <div className="relative h-full bg-slate-50 overflow-auto w-[100%] border-[0.5px] border-black/30 flex items-center justify-center flex-col">
          {/*XMarkIcon className="absolute top-2 right-2 h-8" onClick={()=>{props.setOpen(false)}}></XMarkIcon>*/}
       {
       (!answered && !loading) ?
       <form onSubmit={handleSubmit(reviewPost)} className="relative w-full h-full flex items-center justify-center flex-col ">
          
           <div className="mb-4">
             <div className="flex flex-col items-center justify-center">
             {stars.map((star,i)=>(
                <div key={i} className="flex flex-col items-center w-[100%] max-w-[300px] justify-start mb-2">
                  <div className='p-1'><div key={star} className={`h-8 w-8  cursor-pointer border-[2px] border-black ${starColor[star as keyof typeof starColor]}`} onClick={()=>starsChangeColors(star)}></div></div>
                  <div className='font-semibold text-[18px]'>
                  {i == 0 ?
                            <div>1. Sinus</div> : i == 1 ?
                            <div>2. Afib</div> : i == 2 ?
                            <div>3. AFL</div> : i == 3 ?
                            <div>4. Other</div> : 
                            <div>5. Unreadable</div> }
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
                  {myAnswer == 1 ?
                            <div>Sinus</div> : myAnswer == 2 ?
                            <div>Afib</div> : myAnswer == 3 ?
                            <div>AFL</div> : myAnswer == 4 ?
                            <div>Other</div> : 
                            <div>Unreadable</div> }
                  </div>
          </div> :
        <div className="w-14 h-14 relative"><Image className="animate-spin" fill src={spinner} alt='spinner-img'></Image></div>
       }
       </div>
  )
}

