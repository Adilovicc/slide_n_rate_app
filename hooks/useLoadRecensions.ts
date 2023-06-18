import { useEffect, useState } from "react";
import axios from 'axios';


export default function useLoadRecensions(currentBatch: number, postId: string){
    const [reviews, setReviews] = useState([]);
    const [isMore, setIsMore] = useState(true);
    const [numberOfReviews, setNumberOfReviews] = useState(0);
    const [loading, setLoading] =useState(false);

    useEffect(()=>{
            if(!isMore) return;
            let cancel: () => void = () => {};
            setLoading(true);
            try {
              axios({
                method:'GET',
                url: `https://slide-n-rate-app.vercel.app/api/handlers/loadRecensions`,
                params: {
                    startAt: currentBatch,
                    postId: postId
                },
                cancelToken: new axios.CancelToken(c=>cancel=c)
              }).then(res => {
               
                if(res.data.length<3) setIsMore(false);
                // setStartAt(startLoadingAt+res.data.length);
                setNumberOfReviews(prevNumber=>prevNumber+res.data.length);
                //@ts-ignore 
                setReviews(prevData=>[...prevData,...res.data]);
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
    return {reviews, loading, isMore, numberOfReviews}
}