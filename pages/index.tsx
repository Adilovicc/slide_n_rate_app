
import {useState, useEffect, useRef} from 'react'
import Slide from '../components/Slide'
import CreatePost from '@/components/CreatePost';
import CreatePDFPost from '@/components/CreatePDFPost';
import { getSession, signOut } from 'next-auth/react';
import prisma from '../lib/prismadb';
import { ArrowLeftOnRectangleIcon, ChevronLeftIcon, ChevronRightIcon, TableCellsIcon, Bars3Icon, BookmarkSquareIcon, WrenchIcon } from '@heroicons/react/24/outline';
import useLoadPost from '../hooks/useLoadPost';
import axios from 'axios';
import {ArrowUpTrayIcon, UserPlusIcon, CameraIcon} from '@heroicons/react/24/outline';
import Image from 'next/image';
import AddPhoto from '../components/AddPhoto'
import GenerateUser from '../components/GenerateUser'
import TabularDisplay from '@/components/TabularDisplay';
import { baseUrl } from '../baseUrl';
import Swal from 'sweetalert2';
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';

export default function Home({session, user, examsParticipation}:any){
     
     const router = useRouter();
   
     const [currentBatch, setCrtBatch] = useState(0);
     const [currentExam, setCurrentExam] = useState({title:'', id:'', postsTotal:0});
     const [take, setTake] = useState(user.currentPost+1);
     const [currentPost,setCurrentPost] = useState<number>(0);
     const {posts, numberOfPosts, isMore, loading, setNumberOfPosts, setIsMore, setPosts}= useLoadPost(currentBatch,take,currentExam);
     const [nextPage, setNextPage] = useState(false);
       
     useEffect(()=>{
         if(examsParticipation[0]){
           setCurrentExam({title:examsParticipation[0].exam.title, id:examsParticipation[0].examId, postsTotal:examsParticipation[0].exam.postsTotal});
         }
     },[])

     useEffect(()=>{
        
        if(currentPost==posts.length-1 && isMore && currentPost!==0){
           
           setCrtBatch(prevBatch=>prevBatch+1);
        }
     }, [currentPost])

     useEffect(()=>{
        setCurrentPost(0);
     },[currentExam])
    

     const handleSlideLeft=()=>{
              if(currentPost!=0){
                setCurrentPost(prevPost => prevPost-1);
              }
     }
     const handleSlideRight= ()=>{
             if(currentPost!=posts.length-1){
               setCurrentPost(prevPost=>prevPost+1)
             }
     }

     const [showPublishImage, setShowPublishImage] = useState(false);
     const [showPublishPDFImage, setShowPublishPDFImage] = useState(false);
     const [showDropdownMenu, setShowDDM] = useState(false);
     const [showReviewScr, setShowRevScr] = useState(true);
     const [image, setImage] = useState<any>();

     const [dropDownMenuVisible,setDropDownMenuVisible] = useState(false)
     const [addPhotoScreen, setAddPhotoScreen] = useState(false);
     const [generateUserScreen, setGUS] = useState(false);
     const [tabularDisplay, setTabularDisplay] = useState(false);
     const [examDropDown, setExamDropDown] = useState(false);
     
     const handleShowDropdown = ()=>{
         setShowDDM(prev=>!prev)
     }

     const handleExamDropDown = ()=>{
         setExamDropDown(prev=>!prev)
     }

     const handleAddPhoto = () =>{
         setAddPhotoScreen(prev=>!prev);
     }

     const handleGenUserScr = ()=>{
           setGUS(true);
     }

     const handleTabularDisplay = ()=>{
          setTabularDisplay(true);
     }
     
    const distance = useRef(400);
    const [distanceNow, setDistanceNow] = useState('500');

     useEffect(()=>{
      const object = document.getElementById('updown-icon');
      const windowWidth = window.innerWidth;
    //@ts-ignore
      setDistanceNow(String(Math.floor(windowWidth - object.getBoundingClientRect().right))+'px');
      const handleDistance = ()=>{
        const object = document.getElementById('updown-icon');
        const windowWidth = window.innerWidth;
      //@ts-ignore
        setDistanceNow(String(Math.floor(windowWidth - object.getBoundingClientRect().right))+'px');
      }
      
      addEventListener('resize', handleDistance);

      return() => removeEventListener('resize', handleDistance); 

     })

    
     const handleSaveProgress = () =>{
      axios({
        url:baseUrl+'api/handlers/saveProgress',
        data:{
         currentPost: currentPost,
         userId: user.id
        },
        method:'POST'
      }).then((res)=>{
            if(res){
              Swal.fire({
                position: 'bottom-right',
                icon: 'success',
                title: 'Progress saved!',
                showConfirmButton: false,
                timer: 3000
             });  
            }
      }).catch((err)=>{
        Swal.fire({
          position: 'bottom-right',
          title: 'Error',
          showConfirmButton: false,
          timer: 3000
       });  
      });
     }
     const handleSetCurrentExam=(title:string, examId:string, postsTotal:number)=>{
          setCurrentExam((prevExam)=>({...prevExam, title:title, id:examId, postsTotal:postsTotal}));
          setExamDropDown(false);
     }    

     return(
        <div style={{overflow:'hidden'}} className="w-full pt-16 relative h-screen bg-gray-200">
             <div className={`${addPhotoScreen ? 'fixed' : 'hidden'} top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/30 z-40 backdrop-blur-sm`}>
                   <AddPhoto setAPS={setAddPhotoScreen}></AddPhoto>
             </div>
             <div className={`${generateUserScreen ? 'fixed' : 'hidden'} top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/30 z-40 backdrop-blur-sm`}>
                   <GenerateUser setGenerateScreen={setGUS}></GenerateUser>
             </div>
             <div className={`${tabularDisplay ? 'fixed' : 'hidden'} top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/30 z-40 backdrop-blur-sm`}>
                   <TabularDisplay tabularDisplayState={setTabularDisplay}></TabularDisplay>
             </div>
             <div id="examDropdown" style={{right:`${distanceNow}`}} className={`${examDropDown? 'fixed' : 'hidden'}
              rounded-md bg-[#4d4a4a] px-2 py-2 top-[50px] w-[350px] max-h-[350px] text-white z-10`}>
                  {examsParticipation && examsParticipation.map((item:any, idx:number)=>(
                     <div key={idx} onClick={()=>handleSetCurrentExam(item.exam.title, item.examId, item.exam.postsTotal)} className="text-[20px] font-medium flex 
                     items-center truncate 
                     h-12 w-full transion duration-200 cursor-pointer rounded-lg hover:bg-white/40 px-2">
                        <p className='truncate'>{item.exam.title}</p>
                     </div> 
                  ))
                
                  }
              </div>
            <div className={`${showDropdownMenu ? 'absolute' : 'hidden'} top-[55px] right-[32px] md:right-[80px] ${user.role=='admin' ? 'h-[240px]' : 'h-[90px]'} w-[160px] z-10
                   bg-white rounded-md border-[0.5px] border-black text-sm font-serif px-1`}>
                  <button onClick={()=>signOut()} className="w-full flex items-center py-2 hover:scale-105 rounded-t-md">
                   <ArrowLeftOnRectangleIcon className="h-6 w-6"></ArrowLeftOnRectangleIcon> Log out
                  </button>    
                 { <button onClick={()=>handleSaveProgress()} className="w-full flex items-center py-2 hover:scale-105 rounded-t-md truncate">
                   <BookmarkSquareIcon className="h-6 w-6"></BookmarkSquareIcon> Save progress
                  </button>}
                 {user.role == 'admin' && <button  onClick={()=>handleGenUserScr()}  className="w-full flex items-center py-2 hover:scale-105  rounded-t-md truncate">
                   <UserPlusIcon className="h-6 w-6"></UserPlusIcon> Generate user
                   </button> }   
                  {user.role == 'admin' && <button onClick={()=>handleAddPhoto()} className="w-full flex items-center py-2 hover:scale-105 rounded-t-md truncate">
                   <CameraIcon className="h-6 w-6"></CameraIcon> Add photo
                  </button>}  
                 {user.role == 'admin' && <button onClick={()=>handleTabularDisplay()} className="w-full flex items-center py-2 hover:scale-105 rounded-t-md truncate">
                   <TableCellsIcon className="h-6 w-6"></TableCellsIcon> Tabular display
                  </button>  }
                  {user.role == 'admin' && <button onClick={()=>router.push('/exams')} className="w-full flex items-center py-2 hover:scale-105 rounded-t-md truncate">
                  <WrenchIcon className="w-6 h-6"></WrenchIcon> Exam maintenance
                  </button>  }
            </div>
            <div className={`${showPublishImage ? 'fixed flex' : 'hidden'} top-0 right-0 left-0 bottom-0 justify-center items-center bg-black/20 backdrop-blur-lg z-20`}>
                <CreatePost  setImageDisplay={setShowPublishImage}></CreatePost>
             </div>
             <div className={`${showPublishPDFImage ? 'fixed flex' : 'hidden'} top-0 right-0 left-0 bottom-0 justify-center items-center bg-black/20 backdrop-blur-lg z-20`}>
                <CreatePDFPost setPDFDisplay={setShowPublishPDFImage}></CreatePDFPost>
             </div>
        <section className="w-full fixed top-0  h-16 bg-[rgb(15,15,15)] px-8 md:px-20 flex items-center justify-between text-white">
               <span className="text-white text-[20px] font-bold font-serif">Answer&Slide</span>
               <div className='relative flex items-center'>
                  <div className='text-[20px] font-semibold font-serif'>{currentExam.title}</div>
                   <ChevronUpDownIcon id="updown-icon" className="w-8 h-8 mr-10 relative cursor-pointer" onClick={()=>handleExamDropDown()}>
                   </ChevronUpDownIcon>
                  {user.role=='admin' && <button onClick={()=>setShowPublishImage(true)} className="px-4 py-1 border-[1px] border-white mx-3">Publish</button>}
                  {user.role=='admin' && <button onClick={()=>setShowPublishPDFImage(true)} className="px-4 py-1 border-[1px] border-white mx-3 truncate">Publish PDF</button>}
                
                  {user.role == 'admin' ? user.image ? <div onClick={()=>handleShowDropdown()} className="relative w-10 h-10 rounded-full"><Image className="rounded-full" src={user.image} fill alt='userImg'></Image></div> : 
                  <div onClick={()=>handleShowDropdown()} className="h-10 w-10 bg-white rounded-full"></div> : 
                  <div onClick={()=>handleShowDropdown()} className="w-10 h-10"><Bars3Icon className="w-10 h-10"></Bars3Icon></div>}
               </div>
        </section>
        <section style={{overflow:'overlay'}} className="w-full relative bg-gray-200 h-full flex justify-center items-center">
             <div className="relative w-full  h-full bg-white flex overflow-hidden items-center justify-between">
               {currentExam && (currentExam.postsTotal !== 0) && <div className="absolute right-[50%] z-10 top-0 p-3 bg-white/60 text-[22px] font-bold text-black">{currentPost+1}/{currentExam.postsTotal}</div>}
              {posts && posts.length>0 && <div onClick={()=>handleSlideLeft()} className={`absolute transition ${currentPost==0 ? 'hidden' : 'flex'} flex justify-center items-center
                duration-300 h-[45px] w-[45px] z-10 rounded-full bg-white/40 left-[14px] hover:bg-white/60`}>
                         <ChevronLeftIcon className="w-8 h-8"></ChevronLeftIcon>
                </div>}
               { posts && posts.length>0 &&  <div onClick={()=>handleSlideRight()} className={`${currentPost==posts.length-1 ? 'hidden' : 'flex' } absolute transition duration-300 justify-center items-center
                 h-[45px] w-[45px] z-10 rounded-full bg-white/40 right-[14px] hover:bg-white/60`}>
                         <ChevronRightIcon className="w-8 h-8"></ChevronRightIcon>
                 </div> }
                {
                    posts.map((post, id)=>(
                        <Slide key={id} post={post} currentPost={currentPost} userId={user.id} user={user} setCurrent={handleSlideRight}></Slide> 
                    ))
                }           
             </div>
        </section>
        </div>
     )
    
}


export const getServerSideProps = async (context:any) => {
    const session = await getSession(context);

    if(!session){
      return{
        redirect: {
            destination: '/login',
            permanent: false,
          },
      }
    }
   
    
    const user = await prisma.user.findUnique({
      where:{
          //@ts-ignore
          email: session.user?.email
      }
    })

    const examsParticipation  = await prisma.userExam.findMany({
         select:{
             exam:{
              select:{
                 title:true,
                 postsTotal:true,
              }
             },
             examId:true
         },
         where:{
           userId:user?.id
         },
         orderBy:{
          userAddedTime:'desc'
         }
    })
    
    return {
      props:{
        session,
        user:JSON.parse(JSON.stringify(user)) || null,
        examsParticipation: JSON.parse(JSON.stringify(examsParticipation)) || null
      },
    };
};