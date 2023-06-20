import {useState, useEffect, useRef, useCallback} from 'react'
import { BarsArrowDownIcon, BarsArrowUpIcon,ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import useLoadRecensions from '@/hooks/useLoadRecensions';
import Comment from './Comment';
import axios from 'axios'


export default function Details(props:{post:any, userId:string, user:any, setOpen:(value:boolean)=>void}){
    const [commentSectionActive, setCmtSecAct] = useState(false);
    const stars = [1,2,3,4,5];
    const threeElements = [1,2,3];
    const [currentBatch, setCrtBatch] =useState(0);
    const [myAnswer, setMyAnswer] = useState(0);
    

    const {reviews, isMore, loading, numberOfReviews} = useLoadRecensions(currentBatch, props.post.id);

    const observer = useRef();
    const lastElementView = useCallback((node:any)=>{
        if(loading) return
        if(!isMore) return
       //@ts-ignore
        if(observer.current) observer.current.disconnect()
        //@ts-ignore
        observer.current = new IntersectionObserver(entries => {
          if(entries[0].isIntersecting){
           setCrtBatch(prev=>prev+3);
          }
        })
        //@ts-ignore
        if(node) observer.current.observe(node);
     }, [loading, isMore]);
   
     const [exists,setExists] = useState(true);
     const [clickNumber,setClickNumber] = useState(0);
     useEffect(()=>{
        let cancel: () => void = () => {};
        try {
          axios({
            method:'GET',
            url: `https://slide-n-rate-app.vercel.app/handlers/findMyComment`,
            params: {
                postId: props.post.id,
                userId: props.userId
            },
            cancelToken: new axios.CancelToken(c=>cancel=c)
          }).then(res => {
            if(!res.data){ setExists(false); if(clickNumber!=0) props.setOpen(true)}
            else{ setMyAnswer(res.data[0].grade); setExists(true)};
          }).catch(
            err=> {
                if(axios.isCancel(err)) return
            }
          )
          
        } catch (error) {
         
        }
      
     return ()=> cancel(); 
    },[clickNumber])

    
    return(
        <div className={`coverScr ${commentSectionActive ? 'coverActive' : ''}`}>
        <div className={`${commentSectionActive && 'pt-5'} w-full z-20 relative items-center flex px-3 h-[53px] justify-center py-2 transition-all duration-300 
         delay-700 shadow-md border-[0.5px] bg-[#faf0e670] backdrop-blur-md border-black/40`}>
        
         {!exists ? 
               <div className="flex items-center">
                  <span onClick={()=>{setClickNumber(prevClickNumber=>prevClickNumber+1)}}  className='font-semibold cursor-pointer'>Please submit your answer</span>
                  <ClipboardDocumentCheckIcon onClick={()=>{setClickNumber(prevClickNumber=>prevClickNumber+1)}} className={`h-6 w-6 cursor-pointer`}></ClipboardDocumentCheckIcon>
                 </div> : 
                 <div className="flex items-center">
                    <span className="mr-2">Your submitted answer: </span>
                    
                    <span className="font-semibold">
                     {myAnswer == 1 ? 'Sinus' : myAnswer == 2 ? 'Afib' : myAnswer == 3 ? 'AFL' : myAnswer == 4 ? 'Other' : myAnswer == 5 ? 'Poor record quality' : 'No answer yet'}
                     </span>
                 </div>
                 }
        
       {/* ---------------------THIS WHOLE PART IS FOR DISPLAYING STARS----------------------- */}
         
          
      

             {props.post.numberOfReviews!=0 && props.user.role=='admin' && <div onClick={()=>setCmtSecAct(prevToggle=>!prevToggle)} className={`h-9 w-9 rounded-full ml-5 flex items-center justify-center
                     hover:bg-[rgba(18,18,18,0.2)] transition duration-300`}>
                       {commentSectionActive?<BarsArrowDownIcon className="w-6 h-6"></BarsArrowDownIcon> :<BarsArrowUpIcon className="w-6 h-6"></BarsArrowUpIcon>}
                    </div> }
        </div> 


                <div className={`${commentSectionActive ? 'h-full' : ''} relative w-full flex z-50 h-full justify-center backdrop-blur-sm  border-black/40`}>
                        <div id="scrollbarTarget" style={{overflow:'overlay'}} className="bg-white w-[90%] h-full p-2 pb-20">
                           
                            {reviews.map((rev, i)=>(
                                reviews.length==i+1 ?
                                <div ref={lastElementView} key={i}><Comment review={rev}></Comment></div>
                                :  <div key={i}><Comment review={rev}></Comment></div>
                            ))}

                            {loading &&
                    
                                <section className="lazyLoading flex items-center mb-3">
                                    <div className="w-10 h-10 rounded-full animate-pulse delay-300 bg-[rgba(18,18,18,0.1)]"></div>
                                    <div className="ml-2 h-10 w-[80%] p-2 animate-pulse delay-300 rounded-md border-md bg-[rgba(100,99,99,0.1)]">
                                       <div className="w-[60%] h-[12px] mb-1 bg-[rgba(21,21,21,0.3)]"></div>
                                       <div className="w-[80%] h-[10px] bg-[rgba(142,135,135,0.3)]"></div>
                                    </div>
                               </section>
                             }
                             {loading && <section className="lazyLoading flex items-center mb-3">
                                    <div className="w-10 h-10 rounded-full animate-pulse delay-300 bg-[rgba(18,18,18,0.1)]"></div>
                                    <div className="ml-2 h-10 w-[80%] p-2 animate-pulse delay-300 rounded-md border-md bg-[rgba(100,99,99,0.1)]">
                                       <div className="w-[60%] h-[12px] mb-1 bg-[rgba(21,21,21,0.3)]"></div>
                                       <div className="w-[80%] h-[10px] bg-[rgba(142,135,135,0.3)]"></div>
                                    </div>
                               </section> }
                            
                            {loading && <section className="lazyLoading flex items-center mb-3">
                                    <div className="w-10 h-10 rounded-full animate-pulse delay-300 bg-[rgba(18,18,18,0.1)]"></div>
                                    <div className="ml-2 h-10 w-[80%] p-2 animate-pulse delay-300 rounded-md border-md bg-[rgba(100,99,99,0.1)]">
                                       <div className="w-[60%] h-[12px] mb-1 bg-[rgba(21,21,21,0.3)]"></div>
                                       <div className="w-[80%] h-[10px] bg-[rgba(142,135,135,0.3)]"></div>
                                    </div>
                               </section>}
                             
                        </div>
                </div>
        </div>
    )
}