import { useEffect, useState } from "react";
import axios from 'axios';


export default function useLoadPost(currentBatch: number){
    const [posts, setPosts] = useState([]);
    const [isMore, setIsMore] = useState(true);
    const [numberOfPosts, setNumberOfPosts] = useState(0);
    const [loading, setLoading] =useState(false);

    useEffect(()=>{
            if(!isMore) return;
            let cancel: () => void = () => {};
            setLoading(true);
            try {
              axios({
                method:'GET',
                url: `http://localhost:3000/api/handlers/loadPosts`,
                params: {
                    startAt: currentBatch,
                },
                cancelToken: new axios.CancelToken(c=>cancel=c)
              }).then(res => {
               
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
    }, [currentBatch])
    return {posts, loading, isMore, numberOfPosts}
}