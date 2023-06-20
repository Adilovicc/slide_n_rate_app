
import {useState, useEffect} from 'react'
import Slide from '../components/Slide'
import CreatePost from '@/components/CreatePost';
import CreatePDFPost from '@/components/CreatePDFPost';
import { getSession, signOut } from 'next-auth/react';
import prisma from '../lib/prismadb';
import { ArrowLeftOnRectangleIcon, ChevronLeftIcon, ChevronRightIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import useLoadPost from '../hooks/useLoadPost';
import axios from 'axios';
import {ArrowUpTrayIcon, UserPlusIcon, CameraIcon} from '@heroicons/react/24/outline';
import Image from 'next/image';
import AddPhoto from '../components/AddPhoto'
import GenerateUser from '../components/GenerateUser'
import TabularDisplay from '@/components/TabularDisplay';


export default function Home({session, user}:any){
     const [currentBatch, setCrtBatch] = useState(0);
     const {posts, numberOfPosts, isMore, loading}= useLoadPost(currentBatch);
     const [currentPost,setCurrentPost] = useState(0);

     useEffect(()=>{
        if(currentPost==posts.length-1 && isMore) setCrtBatch(prevBatch=>prevBatch+3);
     }, [currentPost])
     

     const handleSlideLeft=()=>{
              if(currentPost!=0){
                setCurrentPost(prevPost => prevPost-1);
              }
     }
     const handleSlideRight=()=>{
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
     
     const handleShowDropdown = ()=>{
         setShowDDM(prev=>!prev)
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

    

     return(
        <div style={{overflow:'hidden'}} className="w-full relative h-screen flex flex-col">
             <div className={`${addPhotoScreen ? 'fixed' : 'hidden'} top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/30 z-40 backdrop-blur-sm`}>
                   <AddPhoto setAPS={setAddPhotoScreen}></AddPhoto>
             </div>
             <div className={`${generateUserScreen ? 'fixed' : 'hidden'} top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/30 z-40 backdrop-blur-sm`}>
                   <GenerateUser setGenerateScreen={setGUS}></GenerateUser>
             </div>
             <div className={`${tabularDisplay ? 'fixed' : 'hidden'} top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/30 z-40 backdrop-blur-sm`}>
                   <TabularDisplay tabularDisplayState={setTabularDisplay}></TabularDisplay>
             </div>
            <div className={`${showDropdownMenu ? 'absolute' : 'hidden'} top-[55px] right-[32px] md:right-[80px] ${user.role=='admin' ? 'h-[160px]' : 'h-[120px]'} w-[140px] z-10
                   bg-white rounded-md border-[0.5px] border-black text-sm font-serif px-1`}>
                  <button onClick={()=>signOut()} className="w-full flex items-center py-2 hover:scale-105 rounded-t-md">
                   <ArrowLeftOnRectangleIcon className="h-6 w-6"></ArrowLeftOnRectangleIcon> Log out
                  </button>    
                 {user.role == 'admin' && <button  onClick={()=>handleGenUserScr()}  className="w-full flex items-center py-2 hover:scale-105  rounded-t-md truncate">
                   <UserPlusIcon className="h-6 w-6"></UserPlusIcon> Generate user
                   </button> }   
                  <button onClick={()=>handleAddPhoto()} className="w-full flex items-center py-2 hover:scale-105 rounded-t-md truncate">
                   <CameraIcon className="h-6 w-6"></CameraIcon> Add photo
                  </button>  
                 {user.role == 'admin' && <button onClick={()=>handleTabularDisplay()} className="w-full flex items-center py-2 hover:scale-105 rounded-t-md truncate">
                   <TableCellsIcon className="h-6 w-6"></TableCellsIcon> Tabular display
                  </button>  }
            </div>
        <section className="w-full relative h-16 bg-[rgb(15,15,15)] px-8 md:px-20 flex items-center justify-between text-white">
               <span className="text-white text-[20px] font-semibold font-serif">Slide&Rate</span>
               <div className='flex items-center'>
                  {user.role=='admin' && <button onClick={()=>setShowPublishImage(true)} className="px-4 py-1 border-[1px] border-white mx-3">Publish</button>}
                  {user.role=='admin' && <button onClick={()=>setShowPublishPDFImage(true)} className="px-4 py-1 border-[1px] border-white mx-3 truncate">Publish PDF</button>}
                
                  {user.image ? <div onClick={()=>handleShowDropdown()} className="relative w-10 h-10 rounded-full"><Image className="rounded-full" src={user.image} fill alt='userImg'></Image></div> : 
                  <div onClick={()=>handleShowDropdown()} className="h-8 w-8 bg-white rounded-full"></div>}
               </div>
        </section>
        <section style={{overflow:'overlay'}} className="w-full relative bg-gray-200 flex grow justify-center items-center">
             <div className={`${showPublishImage ? 'fixed flex' : 'hidden'} top-0 right-0 left-0 bottom-0 justify-center items-center bg-black/20 backdrop-blur-lg z-20`}>
                <CreatePost  setImageDisplay={setShowPublishImage}></CreatePost>
             </div>
             <div className={`${showPublishPDFImage ? 'fixed flex' : 'hidden'} top-0 right-0 left-0 bottom-0 justify-center items-center bg-black/20 backdrop-blur-lg z-20`}>
                <CreatePDFPost setPDFDisplay={setShowPublishPDFImage}></CreatePDFPost>
             </div>
             <div className="relative w-full max-w-[1200px]  bg-white flex overflow-hidden items-center justify-between">
               <div onClick={()=>handleSlideLeft()} className={`absolute transition ${currentPost==0 ? 'hidden' : 'flex'} flex justify-center items-center
                duration-300 h-[45px] w-[45px] z-10 rounded-full bg-white/40 left-[14px] hover:bg-white/60`}>
                         <ChevronLeftIcon className="w-8 h-8"></ChevronLeftIcon>
                </div>
                <div onClick={()=>handleSlideRight()} className={`${currentPost==posts.length-1 ? 'hidden' : 'flex' } absolute transition duration-300 justify-center items-center
                 h-[45px] w-[45px] z-10 rounded-full bg-white/40 right-[14px] hover:bg-white/60`}>
                         <ChevronRightIcon className="w-8 h-8"></ChevronRightIcon>
                 </div>
                {
                    posts.map((post, id)=>(
                        <Slide key={id} post={post} currentPost={currentPost} userId={user.id} user={user}></Slide> 
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
    
    return {
      props:{
        session,
        user:JSON.parse(JSON.stringify(user)) || null
      },
    };
};