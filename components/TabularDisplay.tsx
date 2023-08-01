import {useEffect, useState} from 'react'
import axios from 'axios';
import { ChevronUpDownIcon, XCircleIcon } from '@heroicons/react/24/outline';
import {baseUrl} from '../baseUrl'
import spinner from '../public/spinner.svg'
import Image from 'next/image';
import { writeFile, utils} from 'xlsx';

export default function TabularDisplay(props:{tabularDisplayState:any}){
     const [users, setUsers] = useState<any>([]);
     const [posts, setPosts] = useState<any>([]);
     const [recensions, setRecensions] = useState<any>([]);
     const [loading, setLoading] = useState(false);
     const [arrayObjects, setArrayObjects] = useState<any>();
     const [prov, setProv] = useState(false);
     const [stage, setStage] = useState(0);
     const [loadingExams, setLoadingExams] = useState(true);
     const [examsList, setExamsList] = useState<any>();
    const [selectedExam, setSelectedExam] = useState<any>();
    useEffect(()=>{
        if(!examsList) axios({
          url:baseUrl+'api/completeview/getExams',
          method:'GET'
        }).then((res)=>{
             setExamsList([...res.data]);
             setSelectedExam(res.data[0]);
            
        }).catch((err)=>{
          console.log(err);
        })

    },[])
    
    useEffect(()=>{
       setStage(0);
    },[selectedExam])

    
     const [tableGenerated, setTableGenerated] = useState(false);
     

     const generateExcelTable = async () => {
        const arrayOfObjects:any = [];
         
         posts.map((post:any, idxU:number)=>{
            let obj = {
                name: post.name ? post.name : `Post${idxU+1}`, // Example name
              };
           
            
                 users.map((user:any,idxP:number)=>{
                  let counter = false;
                  let lock = false;
                  {recensions.map((recension:any, idxR:number)=>{
                    
                            if(counter) counter=false;
                            if(user.id == recension.userId && post.id==recension.postId) {counter=true; lock=true;};
                            if(counter) {let objKey=user.name; obj = Object.assign(obj, { [objKey]: recension.grade.map((itm:number, idx:number)=>{return selectedExam.offeredAnswers[itm-1]}) } );}
                            if(!counter && !lock && idxR==recensions.length-1) {let objKey=user.name; obj=Object.assign(obj, {[objKey]: ['NA']})}
                           
                            
                   })}
            
                  })
              
            arrayOfObjects.push(obj);
           }
        )
        return arrayOfObjects;
     }
     
     const exportToExcel = ()=> {
        const fileName = String(selectedExam.title.replace(/\s/g, "")+'.xlsx');
        
        const arrayModified = arrayObjects.map((obj:any, idx:number)=>{
          const newObj = { ...obj };
      
         
          Object.keys(newObj).forEach((key) => {
        
            if (Array.isArray(newObj[key])) {
              newObj[key] = newObj[key].join('\n'); 
            }
          });
      
          return newObj;
        })
        
        const worksheet = utils.json_to_sheet(arrayModified);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        writeFile(workbook, fileName);
      };
     
     const outputTable = async ()=>{
           setLoading(true);
           const myArray = await generateExcelTable();
           const keys = Object.keys(myArray[0]);
           setArrayObjects(myArray);
       
           setProv(true);
           setStage(2);
           setLoading(false);
     }

     const myTable = ()=>{
        const keys = Object.keys(arrayObjects[0]);
        const myArray = arrayObjects;
     
        return (
            <table className=''>
              <thead>
                <tr className="border-[0.5px] border-black">
                  {keys.map((key, index) => (
                    index==0 ? <th className="border-[2px] bg-[#bf443bc3] text-[20px] font-serif border-black p-[2px] py-[10px] min-w-[20rem]" key={index}>{key}</th> :
                    <th className="border-[2px] text-[20px] bg-[#3ba7bfc3] font-serif border-black p-[2px] py-[10px] min-w-[10rem] max-w-[160px]" key={index}>{key}</th> 
                  ))}
                </tr>
              </thead>
              <tbody>
                {myArray.map((obj:any, rowIndex:number) => (
                  <tr key={rowIndex}>
                    {keys.map((key:any, cellIndex:number) => (
                      cellIndex==0 ? <td className="border-[0.5px] font-semibold text-[18px] border-black p-[2px] min-w-[20rem] text-center" key={cellIndex}>{obj[key]}</td> :
                      <td className="border-[0.5px] border-black p-[4px] min-w-[10rem] max-w-[160px] text-center" key={cellIndex}>{obj[key].map((itm:any,idx:number)=>(<div>{itm}</div>))}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
     }
   

     const fetchData = async () => {
        if(loading) return;
        setLoading(true);
        axios({
            method:'GET',
            url:baseUrl+'api/completeview/getUsers'
          }).then(res => {
             //@ts-ignore 
            setUsers(res.data);
            axios({
                method:'GET',
               url: baseUrl+'api/completeview/getPosts',
               params:{
                examId: selectedExam.id
               }
           }).then(res => {
               //@ts-ignore 
              setPosts(res.data);
              
              axios({
                method:'GET',
                url: baseUrl+'api/completeview/getRecensions'
              }).then(res => {
                 //@ts-ignore 
                setRecensions(res.data);
                setLoading(false);
                setStage(1);
              }).catch((err)=>
                 {  setLoading(false);
                    console.log(err)});
           }).catch((err)=>
          { setLoading(false); 
            console.log(err)});
            
          }).catch((err)=>
             {setLoading(false); setTableGenerated(false); console.log(err);
            }).finally(()=>{
            });
        
     }

     const [dropDownMenu, setDropDownMenu] = useState(false);
    
     const handleSelectExam=(item:any)=>{
         setSelectedExam(item);
         setDropDownMenu(false);
     }
 
     const handleDropDownMenu=()=>{
       setDropDownMenu(prevDD=>!prevDD);
     }

     

     return(
        <div className="w-[90%] h-[90%] rounded-md overflow-auto bg-white px-10 flex flex-col py-16 relative">
           <div className="absolute top-5 right-5"><XCircleIcon className="h-8 w-8" onClick={()=>props.tabularDisplayState(false)}></XCircleIcon></div>
             
             
             <div className="flex relative">
                <div className='text-[20px] font-semibold font-serif'>{selectedExam && selectedExam.title}</div>
                <ChevronUpDownIcon className="w-8 h-8 mr-10 relative cursor-pointer" onClick={()=>handleDropDownMenu()}></ChevronUpDownIcon>
                
               <div className={`${dropDownMenu? 'absolute' : 'hidden'}
                  rounded-md bg-[#4d4a4a] overflow-hidden overflow-y-auto px-2 py-2 top-[30px] w-[350px] max-h-[350px] text-white z-10`}>
                   {examsList && examsList.map((item:any, idx:number)=>(
                     <div key={idx} onClick={()=>handleSelectExam(item)} className="text-[20px] font-medium flex 
                     items-center truncate 
                     h-12 w-full transion duration-200 cursor-pointer rounded-lg hover:bg-white/40 px-2">
                        <p className='truncate'>{item && item.title}</p>
                     </div> 
                  ))
                
                  }
                </div>
             </div>



             {selectedExam && stage == 0 &&  <button onClick={()=>fetchData()} className="px-3 mb-5 text-[20px] w-full max-w-[240px] text-white flex justify-center items-center font-semibold rounded-lg py-4 bg-[#1f87d2]">
                          {!loading ? <span>Fetch data</span> : <div className="h-8 w-8 animate-spin relative"><Image fill src={spinner} alt='spinner'></Image></div> }
                 </button>}
             {selectedExam && stage == 1 && <button onClick={()=>outputTable()} className="px-3 text-[20px] w-full max-w-[240px] mb-5 text-white font-semibold rounded-lg py-4 bg-[#1f87d2]">Generate table</button>}
             {selectedExam && stage == 2 && <button onClick={()=>exportToExcel()} className="px-3 text-[20px] w-full max-w-[240px] mb-5 text-white font-semibold rounded-lg py-4 bg-[#1f87d2]">Export</button>}
             {posts.length>0 && users.length>0 && recensions.length>0 && prov  && stage==2 && !loading && <div className="w-full h-[86%] 
             overflow-auto"> {myTable()} </div>}
            {loading && <div className="w-full flex justify-center">
                        <div className="w-16 h-16 relative animate-spin"><Image src={spinner} fill alt='spinner'></Image></div>
             </div> }   
        </div>
     )

}