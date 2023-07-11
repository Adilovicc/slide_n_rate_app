import prisma from "@/lib/prismadb";
import { getSession } from "next-auth/react";
import {useState, useEffect, useRef, useCallback} from 'react';
import { PlusCircleIcon, ChevronLeftIcon, Cog8ToothIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import ExamBox from '../components/ExamBox'
import ExamForm from '../components/ExamForm'
import { baseUrl } from "@/baseUrl";
import axios from "axios";
import $ from 'jquery'
import ExamDetails from "@/components/ExamDetails";

export default function Exams({user, session}:any){
    const router = useRouter();
    const [examList, setExamList] = useState<any>([]);
    const [createExamActive, setCreateExamActive] = useState(false);
    const [loading,setLoading] = useState(false);
    
    const [currentExam, setCurrentExam] = useState();
    const [examForDelete, setExamForDelete] = useState<any>();
    
    //REFS FOR TRACKING FIXED ELEMENTS STATES ("details" and "create" screens)
    const ref = useRef(false);
    const refFuse = useRef(false);
    const createExam = useRef(false);
    const detailsExam = useRef(false);

    useEffect(()=>{
        setLoading(true);
        
        let cancel: ()=>void=()=>{}; 
        axios({
            method:'GET',
            url:baseUrl+'api/examHandlers/getExams',
            cancelToken: new axios.CancelToken(ct=>cancel=ct)
         }).then((res)=>{
             setExamList(res.data);
             setLoading(false);
         }).catch((err)=>{
            if(axios.isCancel(err)) return;
            return router.reload();
         })
    },[])

    const handleCreateExamDisplay = () =>{
   
        $('#createExamScreen').css('display','flex');
        createExam.current=true;
    }

    const handleShowExamDetails = (item:any) =>{
        setCurrentExam(item);
        $('#examDetailsScreen').css('display','flex');
        detailsExam.current=true;
    }
    
    const handleDetailedClick = useCallback((event:any)=>{

        if(detailsExam.current && refFuse.current && !event.target.closest("#examDetailsForm")){
            detailsExam.current=false;
            refFuse.current=false;
            $('#examDetailsScreen').css('display','none');
        }
        if(detailsExam.current){refFuse.current=true;}
   }, [detailsExam.current])

   const handleCreateClick = useCallback((event:any)=>{
    if(createExam.current && ref.current && !event.target.closest("#createExamForm")){
        createExam.current=false;
        ref.current=false;
        $('#createExamScreen').css('display','none');   
    }
    if(createExam.current){ ref.current=true;}
    }, [createExam.current])

    useEffect(()=>{
        addEventListener('click', handleDetailedClick);
        addEventListener('click', handleCreateClick);
        return () => {
            removeEventListener('click', handleDetailedClick);
            removeEventListener('click', handleCreateClick);
        }
    },[])
   

    const deleteExam=()=>{

    }    


    return(
        <div className="relative h-screen flex flex-col w-full overflow-hidden">
               <div id='createExamScreen' className="fixed z-10 hidden top-0 right-0 left-0 bottom-0 bg-white/30 backdrop-blur-md justify-center items-center">
                     <ExamForm createdBy={user.id} setNewExam={setExamList}></ExamForm>
               </div> 
               <div id='examDetailsScreen' className="fixed z-10 hidden h-full top-0 right-0 left-0 bottom-0 bg-white/30 backdrop-blur-md justify-center items-center">
                   {currentExam && <ExamDetails exam={currentExam}></ExamDetails>}
               </div>
               <div className="w-full flex items-center justify-between px-6 md:px-16 lg:px-20 min-h-[80px] h-[80px] bg-gray-800">
                     <div onClick={()=>router.push('/')} className="aspect-square h-[60%] p-1 rounded-full bg-white/40 hover:bg-white/60 cursor-pointer"><ChevronLeftIcon className="w-full h-full"></ChevronLeftIcon></div>
                     <span className="hidden sm:inline-block text-white text-[36px] font-semibold font-serif">Exam maintenance</span>
                     <div onClick={()=>handleCreateExamDisplay()} className="aspect-square h-[60%] p-1 rounded-full bg-white/40 hover:bg-white/60 cursor-pointer"><PlusIcon className="w-full h-full"></PlusIcon></div>
               </div>
              {loading? <section className="max-h-grow w-full pt-10 pb-20 flex justify-center items-center">
                        <div className="h-[20%] aspect-square">
                             <img src='/spinner.svg' alt='spinner' className="w-full h-full animate-spin"></img>
                        </div>
               </section> :
               <section id='examsListSection' className="max-h-grow w-full pt-10 pb-20 flex justify-center">
                   <div id='examsList' className="flex w-full flex-wrap max-w-[1700px]">
                      { 
                         examList.map((item:any,idx:number)=>(
                            <div className="w-[100%] sm:w-1/2 md:w-1/3 lg:w-1/4 relative p-2 aspect-video" key={idx} onClick={()=>handleShowExamDetails(item)}>
                                <ExamBox exam={item}></ExamBox>
                            </div>
                         ))
                      }
                   </div>
               </section> }
                 
        </div>
    )
}

export const getServerSideProps = async (context:any) =>{
     const session = await getSession(context);

     if (!session) {
        return{
           redirect: {
            destination: '/login',
            permanent: false
           }
        }
     }

     const user = await prisma.user.findUnique({
        where:{
            email: String(session.user?.email)
        }
     })

     if(!user){
        return{
            redirect:{
                destination:'/login',
                permanent:false
            }
        }
     }

     if(user.role!=='admin'){
        return{
            redirect:{
                destination: '/',
                permanent: false
            }
        }       
     }
     
    return{
        props:{
            session: session,
            user: JSON.parse(JSON.stringify(user)),
        }
    }

}