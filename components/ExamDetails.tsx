import {useState, useEffect, useRef, useCallback} from 'react'
import useLoadParticipants from '../hooks/useLoadParticipants'
import axios from 'axios';
import { baseUrl } from '@/baseUrl';
import Swal from 'sweetalert2';
import { TrashIcon, ArchiveBoxArrowDownIcon, ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline';
import { writeFile, utils} from 'xlsx';
import { useRouter } from 'next/router';
import BasicAccordion from './Accordion';
import { Exam } from '@prisma/client';

export default function ExamDetails(props:{exam:any, handleDeleteItem:()=>void}){
      const [userQuery, setUserQuery] = useState<string>('');
      const [currentNumber, setCurrentNumber] = useState(0);
      const [loadingEls] = useState([1,2,3]);
      const [loadingNotes, setLoadingNotes] = useState(false);
      const [notes, setNotes] = useState([]);
       
      const router = useRouter();

      const {isMore, loading, participants, totalParticipantsLoaded, setParticipants} = useLoadParticipants(currentNumber, props.exam.id, userQuery);
      const [currentList, setCurrentList] = useState('members'); 
         
      
      const [deleteScreen, setDeleteScreen] = useState(false);
      useEffect(()=>{setCurrentNumber(0); setDeleteScreen(false); setCurrentList('members');},[props.exam])

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
                    examId:props.exam.id
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
            examId: props.exam.id
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
                examId:props.exam.id,
            }
        }).then((res)=>{
            setNotes(res.data);
        }).catch((err)=>alert('Something went wrong!')).finally(()=>setLoadingNotes(false));
     }
     const [noteQuery,setNoteQuery] = useState('');
     
     const handleExportNotes=()=>{
        const fileName = String(props.exam.title.replace(/\s/g, "")+'Notes.xlsx')
        const worksheet = utils.json_to_sheet(notes);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        writeFile(workbook, fileName);
     }

     
    const deleteExam = ()=>{
        axios({
            url:baseUrl+'api/examHandlers/deleteExam',
            method:'POST',
            data:{
                examId:props.exam.id
            }
        }).then((res)=>{
            Swal.fire({
                title:'Exam deleted!',
                text:'Exam deleted successfully!',
                timer:2000,
                icon:'success'
            });
            router.reload();

        }).catch((err)=>{
            Swal.fire({
                title:'Stg went wrong!',
                timer:2000,
                icon:'error'
            });
            setDeleteScreen(false);
        })
    }

    const sendToArchive = ()=>{
        axios({
            url: baseUrl+'api/examHandlers/regulateArchive',
            method:'POST',
            data:{
                examId:props.exam.id,
                archive:true,
            }
        }).then((res)=>{
            Swal.fire({
                title:'Exam archived!',
                timer:2000,
                icon:'success'
            });
            props.handleDeleteItem();
        }).catch((err)=>{
            Swal.fire({
                title:'Stg went wrong!',
                timer:2000,
                icon:'error'
            });
        })
    }

    const sendToActive = ()=>{
        axios({
            url: baseUrl+'api/examHandlers/regulateArchive',
            method:'POST',
            data:{
                examId:props.exam.id,
                archive:false,
            }
        }).then((res)=>{
            Swal.fire({
                title:'Exam activated!',
                timer:2000,
                icon:'success'
            })
            props.handleDeleteItem();
        }).catch((err)=>{
            Swal.fire({
                title:'Stg went wrong!',
                timer:2000,
                icon:'error'
            });
        })  
    }

    return(
        <div id='examDetailsForm' className="bg-[rgb(34,34,34)] relative m-auto mt-5 mb-5 text-white flex flex-col items-center rounded-lg 
          p-5 w-full max-w-[800px]">
            <div className="absolute top-4 right-4 h-8 p-1 w-8 rounded-full bg-white/60 z-20 cursor-pointer">
                {props.exam.archived ? <div className="relative group">
                    <ArchiveBoxArrowDownIcon onClick={() => sendToActive()} className="w-full h-full"></ArchiveBoxArrowDownIcon>
                    <div className="absolute hidden w-[135px] group-hover:inline text-center bottom-[-40px] right-[-54px]
                     rounded-md py-[4px] z-30 bg-white text-black">Back to active</div>
                    </div> :
                    <div className="relative group">
                        <ArchiveBoxXMarkIcon onClick={() => sendToArchive()} className="w-full h-full"></ArchiveBoxXMarkIcon>
                        <div className="absolute hidden w-[135px] group-hover:inline text-center bottom-[-40px] right-[-54px] 
                        rounded-md py-[4px] z-30 bg-white text-black">Send to archive</div>
                    </div>}
            </div>
            <div className="absolute top-4 cursor-pointer right-[60px] h-8 p-1 w-8 rounded-full bg-white/60 z-20">
                <div className="relative group">
                    <TrashIcon onClick={() => setDeleteScreen(true)} className="w-full h-full"></TrashIcon>
                    <div className="absolute hidden w-[65px] group-hover:inline text-center bottom-[-40px] 
                    right-[-20px] rounded-md py-[4px] z-30 bg-white text-black">Delete</div>
                </div>
            </div>
            <div className={`${deleteScreen ? 'absolute' : 'hidden'} w-full h-full top-0 z-20 flex items-center justify-center rounded-lg`}>
                <div className="bg-white w-[600px] h-[180px] rounded-lg p-5 text-black">
                    <div className="flex justify-center text-center mb-2"><p><b>Are you sure you want to proceed with this action?</b><br></br>
                        This will result in the permanent deletion of the test and all its questions.<br></br>
                        Images/PDF files will still remain in the storage, and you will need to delete them separately there.</p>
                    </div>
                    <div className="w-full flex items-center justify-center space-x-2">
                        <div onClick={() => setDeleteScreen(false)} className=" bg-green-700 rounded-full cursor-pointer text-white w-[100px] flex justify-center py-2 truncate font-bold">CANCEL</div>
                        <div onClick={() => deleteExam()} className=" bg-black rounded-full cursor-pointer text-white w-[100px] flex justify-center py-2 truncate font-bold">DELETE</div>
                    </div>
                </div>
            </div>
            <h1 className="text-[26px] font-semibold mb-5">{props.exam.title}</h1>
            <BasicAccordion description={props.exam.description ? props.exam.description : 'No description'}
                creator={props.exam.creator.name}
                posts={props.exam.postsTotal}
                participants={props.exam.membersTotal}
                offeredAnswers={props.exam.offeredAnswers}
            ></BasicAccordion>
            <div className="w-full my-2">
                <div className="flex bg-[#222831] w-[350px] space-x-2 py-1 rounded-xl justify-center">
                    <div onClick={() => setCurrentList('members')} className={`px-2 py-1 transition duration-300   text-[18px] cursor-pointer 
                 w-40 font-semibold text-center rounded-xl ${currentList == 'members' ? 'bg-[#00ADB5]  border-white text-white' : ''}`}>Examinees list</div>
                    <div onClick={() => handleClickNotes()} className={`px-2 py-1 transition duration-300  text-[18px]  cursor-pointer 
                 w-40 font-semibold text-center rounded-xl ${currentList !== 'members' ? 'bg-[#00ADB5]  border-white text-white' : ''}`}>Examinees notes</div>
                </div>
            </div>
            {currentList == 'members' &&
                <div className="w-full h-[350px] rounded-b-sm">
                    <div className="h-[42px] w-full px-4 max-w-[300px] rounded-full border-[1px] bg-white/20 flex items-center border-white">
                        <input value={userQuery} onChange={(e) => setUserQuery(e.target.value)} placeholder='Search email' className='outline-none bg-white/0'></input>
                    </div>
                    <div id="participantsTable" className="w-full mt-3 p-1 h-[300px] border-[1px] border-white">
                        {participants.map((item: any, idx: number) => (
                            idx == participants.length - 1 ? <div ref={lastElementView} key={item.forTracking} className={`w-full px-2 mt-1 h-12 border-[0.5px] ${item.userExam[0] && item.userExam[0].id ? 'bg-green-700/40' : 'bg-white/10'} border-white flex items-center`}>
                                <div className="w-[35%] truncate flex items-center">{item.name}</div>
                                <div className="w-[40%] truncate flex items-center">{item.email}</div>
                                <div className="w-[25%] h-[80%] truncate flex items-center justify-end">
                                    {item.userExam[0] && item.userExam[0].id ?
                                        <button disabled={handlingInProcess} onClick={() => handleRemoveUser(item, idx)} className="rounded-full h-[80%] w-[100%] max-w-[85px] items-center 
                                        flex justify-center font-semibold bg-red-600/80">Remove</button> :
                                        <button disabled={handlingInProcess} onClick={() => handleAddUser(item, idx)} className="rounded-full h-[80%] w-[100%] max-w-[85px] items-center
                                         flex justify-center font-semibold bg-green-600/80">Add</button>}
                                </div>
                            </div> :
                                <div key={item.forTracking} className={`w-full px-2 mt-1 h-12 border-[0.5px] ${item.userExam[0] && item.userExam[0].id ? 'bg-green-700/40' : 'bg-white/10'} border-white flex items-center`}>
                                    <div className="w-[35%] truncate flex items-center">{item.name}</div>
                                    <div className="w-[40%] truncate flex items-center">{item.email}</div>
                                    <div className="w-[25%] h-[80%] truncate flex items-center justify-end">
                                        {item.userExam[0] && item.userExam[0].id ?
                                            <button disabled={handlingInProcess} onClick={() => handleRemoveUser(item, idx)} className="rounded-full h-[80%] w-[100%] max-w-[85px] items-center 
                                    flex justify-center font-semibold bg-red-600/80">Remove</button> :
                                            <button disabled={handlingInProcess} onClick={() => handleAddUser(item, idx)} className="rounded-full h-[80%] w-[100%] max-w-[85px] items-center
                                     flex justify-center font-semibold bg-green-600/80">Add</button>}
                                    </div>
                                </div>
                        ))}
                        {loading && loadingEls.map((itm: any, idx: number) => (
                            <div key={idx} className={`w-full ${idx % 3 == 0 ? 'animate-pulse' : idx % 3 == 1 ? 'animate-pulse-mid' : 'animate-pulse-slow'} px-2 mt-1 h-12 border-[0.5px] bg-gradient-to-r
                                from-white/30 to-white/10 border-white flex justify-between items-center`}>
                                <div className="w-[20%] h-6 bg-white/70 rounded-full animate-pulse-fast"></div>
                                <div className="w-[30%] h-6 bg-white/60 rounded-full  animate-pulse-faster"></div>
                                <div className="w-[15%] h-6 bg-white/80 rounded-full  animate-pulse-fast"></div>
                            </div>
                        ))}
                    </div>
                </div>}
            {currentList == 'notes' && <div className="w-full h-[350px]">
                {loadingNotes && <div className="h-full w-full flex justify-center items-center">
                    <img className="w-12 h-12 animate-spin" src='/spinner.svg'></img>
                </div>}
                {!loadingNotes && notes &&
                    <div className="flex justify-between items-center">
                        <div className="h-[42px] w-full px-4 max-w-[300px] rounded-full border-[1px] bg-white/20 flex items-center border-white">
                            <input value={noteQuery} onChange={(e) => setNoteQuery(e.target.value)} placeholder='Search by post or email...' className='outline-none bg-white/0'></input>
                        </div>
                        <div onClick={() => handleExportNotes()} className="w-[200px] h-[40px] flex justify-center items-center
                     bg-[#1d90d7] cursor-pointer hover:bg-[#0c72b2]">Export</div>
                    </div>}
                {!loadingNotes && notes && <div className="h-[300px] p-1 border-[0.5px] border-white mt-2 overflow-hidden overflow-y-auto">{notes.map((item: any, idx: number) => (
                    (item.postName.includes(noteQuery) || item.userEmail.includes(noteQuery)) && <div key={idx} className={`w-full px-2 mt-1 min-h-[48px] border-[0.5px]
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