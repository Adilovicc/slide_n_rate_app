import { useEffect, useState } from "react";
import axios from 'axios';
import {baseUrl} from '../baseUrl'

export default function useLoadPost(currentBatch: number, take: number, currentExam:any){
    const [posts, setPosts] = useState([]);
    const [isMore, setIsMore] = useState(false);
    const [numberOfPosts, setNumberOfPosts] = useState(0);
    const [loading, setLoading] =useState(false);

    const [check, setCheck] = useState(false);


    useEffect(()=>{
      setPosts([]);
      setIsMore(true);
      setNumberOfPosts(0);
      setLoading(false);
      setCheck(prevCheck=>!prevCheck)
    },[currentExam])
    

    useEffect(()=>{
            console.log(currentExam);
            console.log(currentExam.id);
            console.log(isMore);
            if(!isMore) return;
            let cancel: () => void = () => {};
            setLoading(true);
            try {
              axios({
                method:'GET',
                url: baseUrl+'api/handlers/loadPosts',
                params: {
                    startAt: numberOfPosts,
                    examId: currentExam.id,
                    take: 3
                },
                cancelToken: new axios.CancelToken(c=>cancel=c)
              }).then(res => {
                console.log("EVO SAD OVDJE!")
                console.log(res.data);
                if(res.data.length<3) setIsMore(false);
                // setStartAt(startLoadingAt+res.data.length);
                setNumberOfPosts(numberOfPosts+res.data.length);
                //@ts-ignore 
                setPosts(prevData=>[...prevData,...res.data]);
                setLoading(false);
              }).catch(
                err=> {
                    if(axios.isCancel(err)) return
                }
              )
              
            } catch (error) {
             
            }
          
         return ()=> cancel(); 
    }, [currentBatch, isMore, check])
    return {posts, loading, isMore, numberOfPosts, setNumberOfPosts, setIsMore, setPosts}
}