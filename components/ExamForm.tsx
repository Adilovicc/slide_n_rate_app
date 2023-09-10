import {useForm} from "react-hook-form"
import {useState,useEffect} from 'react'
import { XMarkIcon } from "@heroicons/react/24/outline";
import $ from 'jquery'
import axios from 'axios'
import { baseUrl } from "@/baseUrl";
import Swal from "sweetalert2";
import Switch from '@mui/material/Switch'



export default function ExamForm({createdBy,setNewExam}:any){
    const {register, handleSubmit, formState:{errors}, setValue} = useForm();
    const [answer, setAnswer] = useState('');
    const [answerList,setAnswerList] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [multipleSelection,setMultipleSelection] = useState(false);
    const [examDescription, setExamDes] = useState<string>('');

    const [crtTo, setCrtTo] = useState();
    useEffect(()=>{
        if(crtTo) setNewExam((prevExam:any)=>[crtTo,...prevExam]);
    },[crtTo])

    const handleForm = (values:any)=>{
        values= {...values, answerList, createdBy, multipleSelection, examDescription};
        setLoading(true);
        axios({
            url:baseUrl+'api/examHandlers/create',
            params:{
                values:JSON.stringify(values)
            },
            method:'GET'
         }).then((res)=>{
            setCrtTo(res.data);
            setAnswer('');
            setAnswerList([]);
            setLoading(false);
            setValue('title','');
            $('#createExamScreen').css('display','none');
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Exam created!',
                timer: 3000
             })
         }).catch((err)=>{
            setLoading(false);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Something went wrong!',
                timer: 3000
             })
         })
    }

    const handleAddAnswer=()=>{
        if(!answer || answer==='') return;
        console.log(errors);
        setAnswerList(prevAL => [...prevAL, answer]);
        setAnswer('');
    }
    const handleDeleteAnswer=(index:number)=>{
      setTimeout(()=> setAnswerList(prevAL => [...prevAL.slice(0,index),...prevAL.slice(index+1)]), 300)
    }
    
   const handleMultipleSelection=()=>{
        setMultipleSelection(prev=>!prev);
   }

   return(
    <div id='createExamForm' className="w-[40%] p-10 m-auto mt-5 mb-5 overflow-y-auto max-h-[calc(100%-30px)] rounded-lg min-w-[400px] bg-[rgb(34,34,34)] text-white">
        <form onSubmit={handleSubmit(handleForm)} className="w-full h-full flex flex-col">
                <div className="my-2 flex flex-col">
                <label className="text-[18px] font-serif">Title</label>
                <input {...register('title',{required:true,minLength:3,maxLength:40})} readOnly={loading} placeholder="Title" className="outline-none text-white bg-white/10  rounded-sm px-2 border-b-[2px] border-white h-12"></input>
                   {errors.title && errors.title.type==='required' && <div className="text-[18px] mt-2 font-serif border-[0.5px] rounded-md text-[#e33333]
                    bg-white flex justify-center border-[#e33333] w-full py-2">This field is required!
                    </div>}
                    {errors.title && errors.title.type=='minLength' && <div className="text-[18px] mt-2 font-serif border-[0.5px] rounded-md text-[#e33333]
                    bg-white flex justify-center border-[#e33333] w-full py-2">It must be over 2 chars!
                    </div>}
                    {errors.title && errors.title.type=='maxLength' && <div className="text-[18px] mt-2 font-serif border-[0.5px] rounded-md text-[#e33333]
                    bg-white flex justify-center border-[#e33333] w-full py-2">It must be less than 40 chars!
                    </div>}
                </div>
                <div className="my-2 flex flex-col w-full">
                <label className="text-[18px] font-serif">Add answer</label>
                  <div className="w-full flex justify-between">
                    <input readOnly={loading} id="answerInput" value={answer} onChange={(e)=>setAnswer(e.target.value)} className="outline-none w-[75%] text-white 
                    rounded-sm bg-white/10 px-2 border-b-[2px] border-white h-12"></input>
                    <div onClick={()=>handleAddAnswer()} className={`w-[23%] ${answer==='' ? 'bg-white/20' : ''} border-[0.5px] border-white transition duration-300 
                    rounded-sm flex justify-center items-center text-[20px] font-semibold cursor-pointer`}>Add</div>
                  </div>
                </div>
                <div className="my-2 flex flex-col">
                   <div className="w-full flex flex-wrap">
                   {answerList.map((item, index)=>(
                        <div key={index} className="p-1 w-1/2 min-w-[240px] h-[50px]">
                            <div className="border-[0.5px] h-full px-2 w-full border-white flex justify-between items-center ">
                                <div className="truncate">{item}</div>
                                <XMarkIcon onClick={()=>handleDeleteAnswer(index)} className="cursor-pointer h-8 w-8"></XMarkIcon>
                            </div>
                        </div>
                   ))}
                   </div>
                  {answerList.length<2 && <div className="text-[18px] font-serif border-[0.5px] rounded-md text-[#e33333]
                    bg-white flex justify-center border-[#e33333] w-full py-2">You have to add at least two offered answers!
                    </div> }
                </div>
                <div className="flex items-center">
                    <span className="font-serif text-[18px]">Multiple selection</span>
                    <Switch
                           checked={multipleSelection}
                           onChange={handleMultipleSelection}
                           inputProps={{ 'aria-label': 'controlled' }}
                          />
                </div>
               <label className="text-[18px] font-serif">Comment/Description</label>
               <div className="bg-white rounded-md border-black/40 resize-none border-[0.5px] text-black">
                   <textarea value={examDescription} placeholder="Type your note/complaint here..." onChange={(e) => setExamDes(e.target.value)} maxLength={600}
                       className="w-full h-[120px] resize-none p-2 outline-none bg-white rounded-md">

                   </textarea>
                   <div className="text-black p-2">{examDescription.length}/600</div>
               </div>
                <button className="w-full max-w-[400px] px-5 mt-5 py-3 cursor-pointer
                 text-white border-[1px] border-white bg-[#17537a] text-[22px]
                 font-bold flex justify-center items-center" disabled={answerList.length<2 || loading}>
                    {!loading? <p>Create</p> : <img className="w-8 h-8 animate-spin" src="/spinner.svg" alt='spinner'></img>}
                </button>
        </form>
    </div>
   )
}