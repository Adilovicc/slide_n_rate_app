import {useState} from 'react'
import axios from 'axios';
import { XCircleIcon } from '@heroicons/react/24/outline';


export default function TabularDisplay(props:{tabularDisplayState:any}){
     const [users, setUsers] = useState<any>([]);
     const [posts, setPosts] = useState<any>([]);
     const [recensions, setRecensions] = useState<any>([]);
     const [loading, setLoading] = useState(false);
    
     const [tableGenerated, setTableGenerated] = useState(false);
     
     const generateTable = () => {
        return(<div>
        { users.map((user:any, idxU:number)=>(
            <div key={user.id} className="flex">
                {
                 posts.map((post:any,idxP:number)=>(
                  <div key={post.id} className="flex">
                     {(idxP==0) && <span className="mr-5 font-semibold">{user.name}</span>}
                        {recensions.map((recension:any, idxR:number)=>(
                             <div key={recension.id} className="flex">
                                {user.id == recension.userId && post.id==recension.postId && <span className="mr-2">Post{idxP+1}:<span className="ml-2">{recension.grade}</span></span>}
                             </div>
                        ))}
                  </div>
                ))
                 }
             </div>
         ))}
        </div>)
     }
   

     const fetchData = () => {
        setLoading(true);
        axios({
            method:'GET',
            url: `https://slide-n-rate-app.vercel.app/api/completeview/getUsers`
          }).then(res => {
             //@ts-ignore 
            setUsers(res.data);
            axios({
                method:'GET',
               url: `https://slide-n-rate-app.vercel.app/api/completeview/getPosts`
           }).then(res => {
               //@ts-ignore 
              setPosts(res.data);
              
              axios({
                method:'GET',
                url: `https://slide-n-rate-app.vercel.app/api/completeview/getRecensions`
              }).then(res => {
                 //@ts-ignore 
                setRecensions(res.data);
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
        <div className="w-[90%] h-[90%] rounded-md overflow-auto bg-white px-10 flex flex-col py-10 relative">
             <div className="absolute top-5 right-5"><XCircleIcon className="h-8 w-8" onClick={()=>props.tabularDisplayState(false)}></XCircleIcon></div>
             {!tableGenerated && !loading && <button onClick={()=>fetchData()} className="px-3 py-2 bg-[#197bc1]">Generate table</button>}
             {generateTable()}
             <div className="w-full">
        </div>       
        </div>
     )

}