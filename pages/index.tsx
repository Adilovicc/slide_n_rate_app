
import {useState, useEffect} from 'react'
import Slide from '../components/Slide'
import CreatePost from '@/components/CreatePost';
import { getSession, signOut } from 'next-auth/react';
import prisma from '../lib/prismadb';
import { ArrowLeftOnRectangleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import useLoadPost from '../hooks/useLoadPost';

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
     const [showDropdownMenu, setShowDDM] = useState(false);
     const [showReviewScr, setShowRevScr] = useState(true);

     return(
        <div style={{overflow:'hidden'}} className="w-full relative h-screen flex flex-col">
            <div className={`${showDropdownMenu ? 'absolute' : 'hidden'} top-[55px] right-[80px] h-[120px] w-[120px] z-10
                   bg-white rounded-md border-[0.5px] border-black`}>
                  <button onClick={()=>signOut()} className="w-full flex justify-center hover:bg-gray-600 rounded-t-md">Log out</button>    
                  <button className="w-full flex justify-center hover:bg-gray-600">Generate user</button>  
                  <button className="w-full flex justify-center hover:bg-gray-600">User settings</button>  
            </div>
        <section className="w-full relative h-16 bg-[rgb(15,15,15)] px-8 md:px-20 flex items-center justify-between text-white">
               <span className="text-white text-[20px] font-semibold font-serif">Slide&Rate</span>
               <div className='flex items-center'>
                  {user.role=='admin' && <button onClick={()=>setShowPublishImage(true)} className="px-4 py-1 border-[1px] border-white mx-3">Publish</button>}
                  <div onClick={()=>signOut()}><ArrowLeftOnRectangleIcon className="h-6 w-6 mx-4"></ArrowLeftOnRectangleIcon></div>
                  <div className="h-8 w-8 bg-white rounded-full"></div>
               </div>
        </section>
        <section style={{overflow:'overlay'}} className="w-full relative bg-gray-200 flex grow justify-center items-center">
             <div className={`${showPublishImage ? 'fixed flex' : 'hidden'} top-0 right-0 left-0 bottom-0 justify-center items-center bg-black/20 backdrop-blur-lg z-20`}>
                <CreatePost></CreatePost>
             </div>
             <div className="relative w-full max-w-lg bg-white flex overflow-hidden items-center justify-between">
               <div onClick={()=>handleSlideLeft()} className="absolute transition flex justify-center items-center
                duration-300 h-[45px] w-[45px] z-10 rounded-full bg-white/40 left-[14px] hover:bg-white/60">
                         <ChevronLeftIcon className="w-8 h-8"></ChevronLeftIcon>
                </div>
                <div onClick={()=>handleSlideRight()} className={`${currentPost==posts.length-1 ? 'hidden' : 'flex' } absolute transition duration-300 justify-center items-center
                 h-[45px] w-[45px] z-10 rounded-full bg-white/40 right-[14px] hover:bg-white/60`}>
                         <ChevronRightIcon className="w-8 h-8"></ChevronRightIcon>
                 </div>
                {
                    posts.map((post, id)=>(
                        <Slide key={id} post={post} currentPost={currentPost} userId={user.id}></Slide> 
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