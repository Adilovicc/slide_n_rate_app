import { baseUrl } from "../baseUrl";
import useLoadUsers from "../hooks/useLoadUsers";
import {useState, useEffect, useCallback, useRef} from 'react';
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";


export default function UsersManagement(props:{handleClose:any}){
    const [currentNumber,setCurrentNumber] = useState(0);
    const [userQuery,setUserQuery] = useState('');
    const {loading, isMore, users} = useLoadUsers(currentNumber, userQuery);
    const [handlingInProcess, setHandlingInProcess] = useState(false);

    const observerr = useRef();
      const lastElementView = useCallback((node:any)=>{
        if(loading) return
        if(!isMore) return
       //@ts-ignore
        if(observerr.current) observerr.current.disconnect()
        //@ts-ignore
        observerr.current = new IntersectionObserver(entries => {
          if(entries[0].isIntersecting){
           setCurrentNumber(prevNumber=>prevNumber+10);
          
          }
        })
        //@ts-ignore
        if(node) observerr.current.observe(node);
     }, [loading, isMore]);
    
     const [hiddenArray, setHiddenArray] = useState<number[]>([]);
     useEffect(()=>{
         setCurrentNumber(0);
     },[userQuery])
    const handleDeleteUser = (item:any, idx:number)=>{
          setHandlingInProcess(true);
          axios({
             url:baseUrl+'api/examHandlers/deleteUser',
             method:'POST',
             data:{
                id:item.id,
             }
          }).then(()=>{
            setHiddenArray(prevHA=>[...prevHA, idx]); 
            setHandlingInProcess(false);
             
          }).catch(()=>{
            setHandlingInProcess(false);
          })
    }
    const [loadingEls] = useState([1,2,3]);
     return(
        <div className="w-[60%] relative rounded-md min-w-[400px] bg-[#33302f] border-md flex justify-center items-center p-10">
               <XMarkIcon className="absolute top-2 right-2 h-10 w-10 text-white cursor-pointer" onClick={()=>props.handleClose()}></XMarkIcon>
               <div className="w-full h-[450px] rounded-b-sm">
                   <div className="h-[42px] w-full px-4 max-w-[300px] rounded-full border-[1px] bg-white/20 flex items-center border-white">
                       <input value={userQuery} onChange={(e)=>setUserQuery(e.target.value)} placeholder='Search email' className='outline-none bg-white/0'></input>
                   </div>
                    <div className="w-full mt-3 p-1 h-[400px] border-[1px] border-white overflow-y-auto">
                          {users.map((item:any, idx:number)=>(
                               idx==users.length-1 ? 
                               <div ref={lastElementView} key={idx} className={`w-full ${hiddenArray.includes(idx) ? 'hidden' : ''} px-2 mt-1 h-12 border-[0.5px] bg-green-700/40 border-white flex items-center`}>
                                    <div className="w-[35%] truncate flex items-center">{item.name}</div>
                                    <div className="w-[40%] truncate flex items-center">{item.email}</div>
                                    <div className="w-[25%] h-[80%] truncate flex items-center justify-end">
                                        
                                        <button disabled={handlingInProcess} onClick={()=>handleDeleteUser(item, idx)} className="rounded-full h-[80%] w-[100%] max-w-[85px] items-center 
                                        flex justify-center font-semibold bg-red-600/80">Delete</button> 
                                    </div>
                                </div> : 
                                <div key={idx} className={`w-full ${hiddenArray.includes(idx) ? 'hidden' : ''} px-2 mt-1 h-12 border-[0.5px] bg-green-700/40 border-white flex items-center`}>
                                <div className="w-[35%] truncate flex items-center">{item.name}</div>
                                <div className="w-[40%] truncate flex items-center">{item.email}</div>
                                <div className="w-[25%] h-[80%] truncate flex items-center justify-end">
                                    <button disabled={handlingInProcess} onClick={()=>handleDeleteUser(item, idx)} className="rounded-full h-[80%] w-[100%] max-w-[85px] items-center 
                                    flex justify-center font-semibold bg-red-600/80">Delete</button> 
                                </div>
                            </div>
                          ))}
                          {loading && loadingEls.map((itm:any,idx:number)=>(
                                <div key={idx} className={`w-full ${idx%3==0 ? 'animate-pulse' : idx%3==1 ? 'animate-pulse-mid' : 'animate-pulse-slow'} px-2 mt-1 h-12 border-[0.5px] bg-gradient-to-r
                                from-white/30 to-white/10 border-white flex justify-between items-center`}>
                                    <div className="w-[20%] h-6 bg-white/70 rounded-full animate-pulse-fast"></div>
                                    <div className="w-[30%] h-6 bg-white/60 rounded-full  animate-pulse-faster"></div>
                                    <div className="w-[15%] h-6 bg-white/80 rounded-full  animate-pulse-fast"></div>
                                </div>
                          ))}
                    </div>
                </div>
        </div>
     )
   
}