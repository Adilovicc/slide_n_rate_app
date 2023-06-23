import { useEffect, useState } from "react";
import axios from 'axios';
import {baseUrl} from '../baseUrl'

export default function useLoadPost(currentBatch: number, take: number){
    const [posts, setPosts] = useState([]);
    const [isMore, setIsMore] = useState(true);
    const [numberOfPosts, setNumberOfPosts] = useState(0);
    const [loading, setLoading] =useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    if(!initialLoading || take<3){
          take=3;       
    }

    useEffect(()=>{
            console.log("TAKE JE: "+take);
            if(!isMore) return;
            let cancel: () => void = () => {};
            setLoading(true);
            try {
              axios({
                method:'GET',
                url: baseUrl+'api/handlers/loadPosts',
                params: {
                    startAt: numberOfPosts,
                    take: take
                },
                cancelToken: new axios.CancelToken(c=>cancel=c)
              }).then(res => {
               
                if(res.data.length<take) setIsMore(false);
                // setStartAt(startLoadingAt+res.data.length);
                setNumberOfPosts(numberOfPosts+res.data.length);
                //@ts-ignore 
                setPosts(prevData=>[...prevData,...res.data]);
                setLoading(false);
                if(initialLoading) {setInitialLoading(false)};
              }).catch(
                err=> {
                    if(axios.isCancel(err)) return
                }
              )
              
            } catch (error) {
             
            }
          
         return ()=> cancel(); 
    }, [currentBatch])
    return {posts, loading, isMore, numberOfPosts}
}