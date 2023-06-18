import {useState, useEffect, useRef, useCallback} from 'react'
import { BarsArrowDownIcon, BarsArrowUpIcon,ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import useLoadRecensions from '@/hooks/useLoadRecensions';
import Comment from './Comment';
import axios from 'axios'


export default function Details(props:{post:any, userId:string, setOpen:(value:boolean)=>void}){
    const [commentSectionActive, setCmtSecAct] = useState(false);
    const stars = [1,2,3,4,5];
    const threeElements = [1,2,3];
    const [currentBatch, setCrtBatch] =useState(0);
    

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

     useEffect(()=>{
        let cancel: () => void = () => {};
        try {
          axios({
            method:'GET',
            url: `http://localhost:3000/api/handlers/findMyComment`,
            params: {
                postId: props.post.id,
                userId: props.userId
            },
            cancelToken: new axios.CancelToken(c=>cancel=c)
          }).then(res => {
            if(!res.data) setExists(false);
          }).catch(
            err=> {
                if(axios.isCancel(err)) return
            }
          )
          
        } catch (error) {
         
        }
      
     return ()=> cancel(); 
    }, [])

    
    return(
        <div className={`coverScr ${commentSectionActive ? 'coverActive' : ''}`}>
        <div className={`${commentSectionActive && 'pt-5'} w-full relative items-center flex px-3 h-[53px] justify-between py-2 transition-all duration-300 
         delay-700 shadow-md border-[0.5px] bg-[#faf0e670] backdrop-blur-md border-black/40`}>
        
         {exists ? <span className="absolute left-[50%]">{props.post.numberOfReviews}</span> : <ClipboardDocumentCheckIcon onClick={()=>{props.setOpen(true)}} className={`h-6 w-6 absolute left-[50%]`}></ClipboardDocumentCheckIcon>}
        
       {/* ---------------------THIS WHOLE PART IS FOR DISPLAYING STARS----------------------- */}
       

       {props.post.numberOfReviews>0 ? <div className="flex">
            { 
            stars.map((item,i)=>{
               if(props.post.avgRating){  
                return(
                 
               (item<=Number(props.post.avgRating)) ? 
               (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" fill="#FFD700" viewBox="0 0 24 24" strokeWidth="0.4" stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
               ) 
               :
               (
               (item-Number(props.post.avgRating)<1) && 
               <svg key={i} viewBox="0 0 24 24" width="24" height="24" >
                <defs>
                  <clipPath id="half-star" clipPathUnits="objectBoundingBox">
                    <rect x="0" y="0" width={`${(1-item+Number(props.post.avgRating))}`} height="1" />
                  </clipPath>
                </defs>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#FFD700" viewBox="0 0 24 24" strokeWidth="0.4" stroke="currentColor" className="w-6 h-6" clipPath="url(#half-star)">   
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
               </svg>
               ) 
              )
            }
          })
          } 
         <div className="text-md font-semibold hidden xsm:inline text-zinc-600">{props.post.avgRating}</div>
         </div> 
           : <div className="font-semibold">No reviews yet</div>
          }

             {props.post.numberOfReviews!=0 && <div onClick={()=>setCmtSecAct(prevToggle=>!prevToggle)} className={`h-9 w-9 rounded-full flex items-center justify-center
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