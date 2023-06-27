import {useEffect, useState} from 'react'
import axios from 'axios';
import { XCircleIcon } from '@heroicons/react/24/outline';
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
    
     const [tableGenerated, setTableGenerated] = useState(false);
     

     const generateExcelTable = async () => {
        const arrayOfObjects:any = [];
         
         users.map((user:any, idxU:number)=>{
            let obj = {
                name: user.name, // Example name
              };
           
            
                 posts.map((post:any,idxP:number)=>{
                  let counter = false;
                  let lock = false;
                  {recensions.map((recension:any, idxR:number)=>{
                    console.log("Tu---");
                            if(counter) counter=false;
                            if(user.id == recension.userId && post.id==recension.postId) {counter=true; lock=true;};
                            if(counter) {let objKey=`Post${idxP+1}`; obj = Object.assign(obj, { [objKey]: recension.grade } );}
                            if(!counter && !lock && idxR==recensions.length-1) {let objKey=`Post${idxP+1}`; obj=Object.assign(obj, { [objKey]: 0})}
                           
                            
                   })}
            
                  })
             console.log(obj);    
            arrayOfObjects.push(obj);
           }
        )
        return arrayOfObjects;
     }
     
     const exportToExcel = ()=> {
        const worksheet = utils.json_to_sheet(arrayObjects);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        writeFile(workbook, 'fileXls.xlsx');
      };
     
     const outputTable = async ()=>{
           setLoading(true);
           const myArray = await generateExcelTable();
           const keys = Object.keys(myArray[0]);
           setArrayObjects(myArray);
           console.log(myArray);
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
                    <th className="border-[2px] text-[20px] bg-[#3ba7bfc3] font-serif border-black p-[2px] py-[10px] min-w-[10rem]" key={index}>{key}</th> 
                  ))}
                </tr>
              </thead>
              <tbody>
                {myArray.map((obj:any, rowIndex:number) => (
                  <tr key={rowIndex}>
                    {keys.map((key:any, cellIndex:number) => (
                      cellIndex==0 ? <td className="border-[0.5px] font-semibold text-[18px] border-black p-[2px] min-w-[20rem] text-center" key={cellIndex}>{obj[key]}</td> :
                      <td className="border-[0.5px] border-black p-[4px] min-w-[10rem] text-center" key={cellIndex}>{obj[key]}</td>
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
               url: baseUrl+'api/completeview/getPosts'
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

     return(
        <div className="w-[90%] h-[90%] rounded-md overflow-auto bg-white px-10 flex flex-col py-16 relative">
             <div className="absolute top-5 right-5"><XCircleIcon className="h-8 w-8" onClick={()=>props.tabularDisplayState(false)}></XCircleIcon></div>
             {stage == 0 &&  <button onClick={()=>fetchData()} className="px-3 mb-5 text-[20px] w-full max-w-[240px] text-white flex justify-center items-center font-semibold rounded-lg py-4 bg-[#1f87d2]">
                          {!loading ? <span>Fetch data</span> : <div className="h-8 w-8 animate-spin relative"><Image fill src={spinner} alt='spinner'></Image></div> }
                 </button>}
             {stage == 1 && <button onClick={()=>outputTable()} className="px-3 text-[20px] w-full max-w-[240px] mb-5 text-white font-semibold rounded-lg py-4 bg-[#1f87d2]">Generate table</button>}
             {stage == 2 && <button onClick={()=>exportToExcel()} className="px-3 text-[20px] w-full max-w-[240px] mb-5 text-white font-semibold rounded-lg py-4 bg-[#1f87d2]">Export</button>}
             {posts.length>0 && users.length>0 && recensions.length>0 && prov  && !loading && myTable()}
            {loading && <div className="w-full flex justify-center">
                        <div className="w-16 h-16 relative animate-spin"><Image src={spinner} fill alt='spinner'></Image></div>
             </div> }   
        </div>
     )

}