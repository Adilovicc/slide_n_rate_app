import {useState, useEffect, useRef, useCallback} from 'react'
import useLoadParticipants from '../hooks/useLoadParticipants'
import axios from 'axios';
import { baseUrl } from '@/baseUrl';
import Swal from 'sweetalert2';
import { ReceiptRefundIcon } from '@heroicons/react/24/outline';
import { writeFile, utils} from 'xlsx';

export default function ExamDetails({exam}:any){
      const [userQuery, setUserQuery] = useState<string>('');
      const [currentNumber, setCurrentNumber] = useState(0);
      const [loadingEls] = useState([1,2,3]);
      const [loadingNotes, setLoadingNotes] = useState(false);
      const [notes, setNotes] = useState([]);
       
     

      const {isMore, loading, participants, totalParticipantsLoaded, setParticipants} = useLoadParticipants(currentNumber, exam.id, userQuery);
      const [currentList, setCurrentList] = useState('members'); 
         
    
      useEffect(()=>{setCurrentNumber(0), setCurrentList('members')},[exam])

      const observer = useRef();
      const lastElementView = useCallback((node:any)=>{
        if(loading) return
        if(!isMore) return
       //@ts-ignore
        if(observer.current) observer.current.disconnect()
        //@ts-ignore
        observer.current = new IntersectionObserver(entries => {
          if(entries[0].isIntersecting){
           setCurrentNumber(prevNumber=>prevNumber+4);
          
          }
        })
        //@ts-ignore
        if(node) observer.current.observe(node);
     }, [loading, isMore]);

      useEffect(()=>{
          setCurrentNumber(0);
      }, [userQuery]);
      
     const [handlingInProcess, setHandlingInProcess] = useState(false);

     const handleRemoveUser = (item:any, idx:number)=> {
           if(item.userExam.length>0 && !handlingInProcess){
                setHandlingInProcess(true);
                axios({
                   url:baseUrl+'api/examHandlers/removeParticipant',
                   method:'POST',
                   data:{
                    id:item.userExam[0].id,
                    examId:exam.id
                   }
                }).then((res)=>{
                    const newTracking = item.forTracking+'x';
                    const objectForChange = {...item, userExam:[], forTracking:newTracking}
                    setParticipants((prevParticipants:any)=>[...prevParticipants.slice(0,idx), objectForChange, ...participants.slice(idx+1)]);
                }).catch((err)=>{
                    Swal.fire({
                        title:'Error',
                        text:'Something went wrong. Please reload page and try again',
                        timer:4000,
                        icon:'error'
                    })
                }).finally(()=>setHandlingInProcess(false));
           }
     }
     
     

     const handleAddUser = async (item:any, idx:number)=>{
        setHandlingInProcess(true);
        const objArray= await axios({
          url:baseUrl+'api/examHandlers/addParticipant',
          method:'GET',
          params:{
            userId: item.id,
            examId: exam.id
          }
        }).then((res)=>{
         
            const newTracking = participants[idx].forTracking + 'x';
            const objectForChange = {...participants[idx], userExam:[{id:res.data.id}], forTracking:newTracking};
            const objectArray=([...participants.slice(0,idx),objectForChange, ...participants.slice(idx+1)]);
            setHandlingInProcess(false);
            return objectArray
        }).catch((err)=>{
            setHandlingInProcess(false);
            Swal.fire({
                title:'Error',
                text:'Something went wrong. Maybe that user already participates.',
                timer:4000,
                icon:'error'
            })
            return null;
        })
        if(objArray) setParticipants(objArray);
     }
     
     const handleClickNotes=()=>{
        setCurrentList('notes');
        setLoadingNotes(true);
        axios({
            url:baseUrl+'api/examHandlers/getNotes',
            method:'GET',
            params:{
                examId:exam.id,
            }
        }).then((res)=>{
            console.log(res.data);
            setNotes(res.data);
        }).catch((err)=>alert('Something went wrong!')).finally(()=>setLoadingNotes(false));
     }
     const [noteQuery,setNoteQuery] = useState('');
     
     const handleExportNotes=()=>{
        const fileName = String(exam.title.replace(/\s/g, "")+'Notes.xlsx')
        const worksheet = utils.json_to_sheet(notes);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        writeFile(workbook, fileName);
     }
     
    return(
        <div id='examDetailsForm' className="bg-[rgb(34,34,34)] text-white flex flex-col items-center rounded-lg 
          p-5 w-full max-w-[800px]">
            <h1 className="text-[26px] font-semibold">{exam.title}</h1>
            <div className="w-full flex flex-wrap justify-center text-lg font-semibold">
                    <div className="w-full truncate max-w-[220px] m-2 h-6 px-2 bg-white text-black/80 flex items-center">
                         Author: {exam.creator.name}
                    </div>
                    <div className="w-full truncate max-w-[220px] m-2 h-6 px-2 bg-white text-black/80  flex items-center">
                         Participants: {exam.membersTotal}
                    </div>
                    <div className="w-full truncate max-w-[220px] m-2 h-6 px-2 bg-white text-black/80 flex items-center">
                         Posts: {exam.postsTotal}
                    </div>
            </div>
            <div className="mt-4 w-full text-[18px]">
                <span className="font-serif ml-10">{exam.offeredAnswers.length} offered answers:</span>
                 <div className="w-full flex flex-wrap">
                {
                    exam.offeredAnswers && exam.offeredAnswers.map((item:String, index:number)=>(
                        <div key={index} className="w-[50%] min-w-[330px] p-1">
                            <div className="w-full h-full px-2 border-[1px] border-white rounded-md">
                             <span>{index+1}.</span><span>{item}</span>
                            </div>
                        </div>
                    ))
                    
                }
                </div>
            </div>
            <div className="w-full flex">
               <div onClick={()=>setCurrentList('members')} className={`px-2 py-1 transition duration-300 mt-5 mr-2 text-[18px] my-2 cursor-pointer border-[1px] border-black
                 w-40 font-semibold ${currentList!=='members'? 'bg-black border-[1px] border-white text-white': 'text-black bg-white/80'}`}>Examinees list</div>
               <div onClick={()=>handleClickNotes()} className={`px-2 py-1 transition duration-300 mt-5 text-[18px] my-2 cursor-pointer border-[1px] border-black
                 w-40 font-semibold ${currentList=='members'? 'bg-black border-[1px] border-white text-white': 'text-black bg-white/80'}`}>Examinees notes</div>
             </div>
            {currentList == 'members' &&
            <div className="w-full h-[350px] rounded-b-sm">
                   <div className="h-[42px] w-full px-4 max-w-[300px] rounded-full border-[1px] bg-white/20 flex items-center border-white">
                       <input value={userQuery} onChange={(e)=>setUserQuery(e.target.value)} placeholder='Search email' className='outline-none bg-white/0'></input>
                   </div>
                    <div id="participantsTable" className="w-full mt-3 p-1 h-[300px] border-[1px] border-white">
                          {participants.map((item:any, idx:number)=>(
                               idx==participants.length-1 ? <div ref={lastElementView} key={item.forTracking} className={`w-full px-2 mt-1 h-12 border-[0.5px] ${item.userExam[0] && item.userExam[0].id ? 'bg-green-700/40' : 'bg-white/10'} border-white flex items-center`}>
                                    <div className="w-[35%] truncate flex items-center">{item.name}</div>
                                    <div className="w-[40%] truncate flex items-center">{item.email}</div>
                                    <div className="w-[25%] h-[80%] truncate flex items-center justify-end">
                                        {item.userExam[0] && item.userExam[0].id? 
                                        <button disabled={handlingInProcess} onClick={()=>handleRemoveUser(item, idx)} className="rounded-full h-[80%] w-[100%] max-w-[85px] items-center 
                                        flex justify-center font-semibold bg-red-600/80">Remove</button> : 
                                        <button disabled={handlingInProcess} onClick={()=>handleAddUser(item, idx)} className="rounded-full h-[80%] w-[100%] max-w-[85px] items-center
                                         flex justify-center font-semibold bg-green-600/80">Add</button>}
                                    </div>
                                </div> : 
                                <div key={item.forTracking} className={`w-full px-2 mt-1 h-12 border-[0.5px] ${item.userExam[0] && item.userExam[0].id ? 'bg-green-700/40' : 'bg-white/10'} border-white flex items-center`}>
                                <div className="w-[35%] truncate flex items-center">{item.name}</div>
                                <div className="w-[40%] truncate flex items-center">{item.email}</div>
                                <div className="w-[25%] h-[80%] truncate flex items-center justify-end">
                                    {item.userExam[0] && item.userExam[0].id? 
                                    <button disabled={handlingInProcess} onClick={()=>handleRemoveUser(item, idx)} className="rounded-full h-[80%] w-[100%] max-w-[85px] items-center 
                                    flex justify-center font-semibold bg-red-600/80">Remove</button> : 
                                    <button disabled={handlingInProcess} onClick={()=>handleAddUser(item, idx)} className="rounded-full h-[80%] w-[100%] max-w-[85px] items-center
                                     flex justify-center font-semibold bg-green-600/80">Add</button>}
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
            </div>}
            {currentList=='notes' && <div className="w-full h-[350px]">
               {loadingNotes && <div className="h-full w-full flex justify-center items-center">
                   <img className="w-12 h-12 animate-spin" src='/spinner.svg'></img>
                </div>}
                {!loadingNotes && notes && 
                <div className="flex justify-between items-center">
                    <div className="h-[42px] w-full px-4 max-w-[300px] rounded-full border-[1px] bg-white/20 flex items-center border-white">
                       <input value={noteQuery} onChange={(e)=>setNoteQuery(e.target.value)} placeholder='Search by post or email...' className='outline-none bg-white/0'></input>
                   </div>
                    <div onClick={()=>handleExportNotes()} className="w-[200px] h-[40px] flex justify-center items-center
                     bg-[#1d90d7] cursor-pointer hover:bg-[#0c72b2]">Export</div>
                </div>}   
                {!loadingNotes && notes && <div className="h-[300px] p-1 border-[0.5px] border-white mt-2 overflow-hidden overflow-y-auto">{ notes.map((item:any, idx:number)=>(
                    (item.postName.includes(noteQuery) || item.userEmail.includes(noteQuery)) && <div key={idx}  className={`w-full px-2 mt-1 min-h-[48px] border-[0.5px]
                      bg-white/10 border-white
                      flex items-center`}>
                         <div className="w-[20%] truncate">{item.postName}</div>
                         <div className="w-[35%] truncate">{item.userEmail}</div>
                         <div className="w-[45%]">{item.text}</div>
                      </div>
                ))}</div>}
            </div>}
        </div>
    )
}