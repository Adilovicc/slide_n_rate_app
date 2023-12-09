import prisma from "@/lib/prismadb";
import { getSession } from "next-auth/react";
import {useState, useEffect, useRef, useCallback} from 'react';
import { PlusCircleIcon, ChevronLeftIcon, Cog8ToothIcon, PlusIcon, 
         TrashIcon, UserGroupIcon, ArchiveBoxIcon, ArchiveBoxArrowDownIcon, ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import ExamBox from '../components/ExamBox'
import ExamForm from '../components/ExamForm'
import UsersManagement from '../components/UsersManagement'
import { baseUrl } from "@/baseUrl";
import axios from "axios";
import $ from 'jquery'
import ExamDetails from "@/components/ExamDetails";

export default function Exams({user, session}:any){
    const router = useRouter();
    const [examList, setExamList] = useState<any>([]);
    const [createExamActive, setCreateExamActive] = useState(false);
    const [loading,setLoading] = useState(false);
    const [archiveActive, setArchiveActive] = useState<boolean>(false);
    const [currentExam, setCurrentExam] = useState();
    const [currentItemNo, setCurrentItemNo] = useState<number>();

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
            cancelToken: new axios.CancelToken(ct=>cancel=ct),
            params:{
                archive:archiveActive,
            }
         }).then((res)=>{
             setExamList(res.data);
             setLoading(false);
         }).catch((err)=>{
            if(axios.isCancel(err)) return;
            return router.reload();
         })
    },[archiveActive,router])

    const handleCreateExamDisplay = () =>{
   
        $('#createExamScreen').css('display','flex');
        createExam.current=true;
    }

    const handleShowExamDetails = (item:any) =>{
        setCurrentExam(item);
        $('#examDetailsScreen').css('display','inline');
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
   
    const [usersDisplay, setUsersDisplay] = useState(false);
    const handleUsersDisplay= ()=>{
          setUsersDisplay(prevDisp=>!prevDisp);
    }
    
    const handleShowArchive = () => {
        setArchiveActive(prev=>!prev);
    }

    const handleDeleteItem = () =>{
        console.log("Tu smo");
        if(typeof(currentItemNo)=='number')
        {
            setExamList((prev:any)=>[...prev.slice(0,currentItemNo), ...prev.slice(currentItemNo+1)]);
            detailsExam.current=false;
            refFuse.current=false;
            $('#examDetailsScreen').css('display','none');
        }
    }

    const handleGoBack = () =>{
        if(archiveActive){
            handleShowArchive();
        }
        else{
            router.push('/');
        }
    }

    return(
        <div className="relative h-screen flex flex-col w-full overflow-hidden bg-[#EEEEEE]">
               <div id='createExamScreen' className="fixed z-10 hidden top-0 right-0 left-0 bottom-0 bg-white/30
                backdrop-blur-md justify-center items-center">
                     <ExamForm createdBy={user.id} setNewExam={setExamList}></ExamForm>
               </div> 
               <div id='examDetailsScreen' className="fixed z-10 hidden h-full top-0 right-0 left-0 bottom-0 bg-white/30 backdrop-blur-md">
                   {currentExam && <ExamDetails exam={currentExam} handleDeleteItem={handleDeleteItem}></ExamDetails>}
               </div>
               <div id='usersManagement' className={`z-10 ${usersDisplay? 'fixed' : 'hidden'} h-full w-full flex top-0 right-0 left-0 bottom-0
                bg-white/30 backdrop-blur-md justify-center items-center`}>
                   {usersDisplay && <UsersManagement handleClose={handleUsersDisplay}></UsersManagement>}
               </div>
               <div className="w-full flex items-center justify-between px-6 md:px-16 lg:px-20 h-[60px] bg-[#393E46]">
                     <div onClick={()=>handleGoBack()} className="aspect-square h-[60%] p-1 rounded-full bg-white/40 hover:bg-white/60 
                     cursor-pointer"><ChevronLeftIcon className="w-full h-full"></ChevronLeftIcon></div>
                     <span className="hidden sm:inline-block text-white text-[32px] font-semibold font-serif">Exam maintenance {archiveActive && '- ARCHIVE'}</span>
                     
                     <div className="flex items-center h-full"> 
                        {!archiveActive && <div onClick={()=>handleShowArchive()} className="relative group aspect-square h-[60%] p-1 rounded-full
                         bg-white/40 hover:bg-white/60 cursor-pointer mr-3">
                            <ArchiveBoxIcon className="w-full h-full"></ArchiveBoxIcon> 
                            <div className="hidden absolute z-50 top-10 py-[2px] group-hover:inline rounded-md right-[-20px] px-3 bg-black/90
                             text-white">Archive</div>
                        </div>}
                        <div onClick={()=>handleUsersDisplay()} className="relative group aspect-square h-[60%] p-1 rounded-full
                         bg-white/40 hover:bg-white/60 cursor-pointer mr-3"><UserGroupIcon className="w-full h-full"></UserGroupIcon>
                         <div className="absolute hidden z-50 group-hover:inline top-10 py-[2px] rounded-md right-[-15px] px-3 bg-black/90
                          text-white">Users</div>
                         </div>
                        <div onClick={()=>handleCreateExamDisplay()} className="relative group aspect-square h-[60%] p-1 rounded-full bg-white/40
                         hover:bg-white/60 cursor-pointer"><PlusIcon className="w-full h-full"></PlusIcon>
                          <div className="hidden absolute top-10 py-[2px] group-hover:inline justify-center rounded-md right-[-20px] px-3 z-50 bg-black/90 text-white">Create</div>
                         </div>
                     </div>
               </div>
              {loading? <section className="max-h-grow w-full pt-10 pb-20 flex justify-center items-center">
                        <div className="h-[20%] aspect-square">
                             <img src='/spinner.svg' alt='spinner' className="w-full h-full animate-spin"></img>
                        </div>
               </section> :
               <section id='examsListSection' className="max-h-grow w-full pt-5 pb-20 flex justify-center bg-[#EEEEEE]">
                   <div id='examsList' className="flex w-full flex-wrap max-w-[1700px]">
                      { 
                         examList.map((item:any,idx:number)=>(
                            <div className="w-[100%] sm:w-1/2 md:w-1/3 lg:w-1/4 relative p-2 aspect-video" key={idx} onClick={()=>{handleShowExamDetails(item); setCurrentItemNo(idx)}}>
                                <ExamBox exam={item} deleteItem={handleDeleteItem}></ExamBox>
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