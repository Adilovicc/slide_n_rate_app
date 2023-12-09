import { useEffect, useState } from "react";
import axios from 'axios';
import {baseUrl} from '../baseUrl'


export default function useLoadPost(currentBatch: any, currentExam:any){
    const [posts, setPosts] = useState([]);
    const [isMore, setIsMore] = useState(false);
    const [numberOfPosts, setNumberOfPosts] = useState(0);
    const [loading, setLoading] =useState(false);
    const [toAddOn, setToAddOn] = useState(0);

   

    useEffect(()=>{
      setPosts([]);
      setIsMore(true);
      setNumberOfPosts(0);
      setToAddOn(0);
      setLoading(false);
    },[currentExam])

    useEffect(()=>{
          
            if(!isMore) return;
            if(currentBatch.length<1) return;
            let cancel: () => void = () => {};
            setLoading(true);
            
            try {
              axios({
                method:'GET',
                url: baseUrl+'api/handlers/loadPosts',
                params: {
                    examId: currentExam.id,
                    array: JSON.stringify(currentBatch)         
                },
                cancelToken: new axios.CancelToken(c=>cancel=c)
              }).then(res => {
             
      
                if(res.data.length<3) {
                  setIsMore(false);
                }
                // setStartAt(startLoadingAt+res.data.length);
                setNumberOfPosts(numberOfPosts+res.data.length);
                //@ts-ignore 
                setPosts(prevData=>[...prevData,...res.data].slice(-10));
                if ([...posts, ...res.data].length>10 && toAddOn==0) {setToAddOn([...posts, ...res.data].length-10);}
                else if ([...posts, ...res.data].length>10 && toAddOn!=0) {setToAddOn(prevAddOn=>prevAddOn+res.data.length)}
                
                setLoading(false);
              }).catch(
                err=> {
                    setLoading(false);
                    if(axios.isCancel(err)) return
                }
              )
              
            } catch (error) {
             
            }
          
         return ()=> cancel(); 
    }, [currentBatch])
    return {posts, loading, isMore, numberOfPosts, setNumberOfPosts, setIsMore, setPosts, toAddOn}
}