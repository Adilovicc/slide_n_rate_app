import {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import { baseUrl } from '@/baseUrl';

interface User {
    id:string,
    name: string,
    email:string,
}

export default function useLoadUsers(currentNumber:number, userQuery:string){
     const [loading,setLoading] = useState(false);
     const [isMore, setIsMore] = useState(true);
     const [users, setUsers] = useState<User[]>([]);
     const [totalUsersLoaded, setTPL] = useState(0);
     
     const howManyToTakeWithEachRequest=10;

     useEffect(()=>{
         setIsMore(true);
         setUsers([]);
         setTPL(0);
     },[userQuery])
     
     useEffect(()=>{
        if(!isMore && currentNumber!=0) return;
        let cancel: ()=>void=()=>{};
        setLoading(true);
        
        axios({
            url:baseUrl+'api/examHandlers/loadUsers',
            method:'GET',
            params:{
               skip:currentNumber,
               take:howManyToTakeWithEachRequest,
               query:userQuery
            },
            cancelToken: new axios.CancelToken(c=>cancel=c)
        }).then((res)=>{
            if(res.data.length<howManyToTakeWithEachRequest) setIsMore(false);
            //@ts-ignore
            if(res.data.length>0) {
                const dataA = res.data;
                
                setUsers((prevPart:any)=>[...prevPart,...dataA]);
            }
            setTPL(prevTPL => prevTPL+res.data.length);
            setLoading(false);
        }
        ).catch((err)=>{
            if(axios.isCancel(err)) return;
            setLoading(false);
        })
        
        return ()=> cancel();
     },[currentNumber,userQuery])

     return {users, setUsers, isMore, totalUsersLoaded, loading}
}