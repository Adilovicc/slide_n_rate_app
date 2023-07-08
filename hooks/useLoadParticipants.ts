import {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import { baseUrl } from '@/baseUrl';


export default function useLoadParticipants(currentNumber:number, examId: string, userQuery:string){
     const [loading,setLoading] = useState(false);
     const [isMore, setIsMore] = useState(true);
     const [participants, setParticipants] = useState<any>([]);
     const [totalParticipantsLoaded, setTPL] = useState(0);
     
     const howManyToTakeWithEachRequest=4;

     useEffect(()=>{
         setIsMore(true);
         setParticipants([]);
         setTPL(0);
     },[examId, userQuery])
     
     useEffect(()=>{
        if(!isMore && currentNumber!=0) return;
        let cancel: ()=>void=()=>{};
        setLoading(true);
        
        axios({
            url:baseUrl+'api/examHandlers/loadParticipants',
            method:'GET',
            params:{
               examId: examId,
               skip:currentNumber,
               take:howManyToTakeWithEachRequest,
               query:userQuery
            },
            cancelToken: new axios.CancelToken(c=>cancel=c)
        }).then((res)=>{
            if(res.data.length<howManyToTakeWithEachRequest) setIsMore(false);
            //@ts-ignore
            if(res.data.length>0) {
                const dataA = res.data.map((item:any)=>{ return {...item, forTracking:item.id}})
                
                setParticipants((prevPart:any)=>[...prevPart,...dataA]);
            }
            setTPL(prevTPL => prevTPL+res.data.length);
            setLoading(false);
        }
        ).catch((err)=>{
            if(axios.isCancel(err)) return;
            setLoading(false);
        })
        
        return ()=> cancel();
     },[currentNumber,userQuery,examId])

     return {participants, setParticipants, isMore, totalParticipantsLoaded, loading}
}