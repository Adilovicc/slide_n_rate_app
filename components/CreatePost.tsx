
import {storage} from '../lib/firebase'
import {useState, useEffect} from 'react'
import {ref, getDownloadURL, uploadBytes, deleteObject} from 'firebase/storage'
import {v4} from 'uuid'
import {ArrowUpTrayIcon} from '@heroicons/react/24/outline'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Swal from 'sweetalert2'
import {useRouter} from 'next/router'

export default function CreatePost(){
    
    const session = useSession();
    const router = useRouter();

    const [currentRef, setCurrentRef] = useState<any>();
    const [pickedImage, setPickedImage] = useState<any>();
    const [loading, setLoading] = useState(false);
   
    const uploadImage = async ()=>{
      if(loading) return;
      if(!pickedImage) return;
      setLoading(true);
      let image;
      if(currentRef) deleteObject(currentRef);
       const lokacija = ref(storage,`images/${pickedImage.name+v4()}`);
       setCurrentRef(lokacija);
       const uploadImageVar = uploadBytes(lokacija, pickedImage).then((res)=>{
           getDownloadURL(lokacija).then((downloadUrl)=>{
                 image=downloadUrl;
                 
                 axios({
                    url:'http://localhost:3000/api/handlers/publishPost',
                    data:{
                     imageUrl: image,
                     //@ts-ignore
                     session: JSON.stringify(session)
                    },
                    method:'POST'
                  }).then((res)=>{
                        if(res){
                          Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'New post has been added!',
                            showConfirmButton: true,
                            timer: 4000
                         }).then(router.reload);  
                        }
                  }).catch((err)=>{
                    Swal.fire({
                      position: 'bottom-right',
                      icon: 'error',
                      title: 'Error',
                      showConfirmButton: false,
                      timer: 2500
                   }).then(router.reload); ;  
                  });
                  
                 

            }).catch((err)=>console.log(err));
       });
    
     
    }

    const selectImage= (value:any) =>{
        if(!value) return alert('You have to select picture!');
        setPickedImage(value);
    }

     return(
         <div className="w-[90%] max-w-[400px] rounded-xl px-5 py-10 flex bg-white flex-col justify-center items-center z-20 text-white">
              <label
                    //@ts-ignore 
                    htmlFor='imageUploadButton' className="w-[80%] cursor-pointer transition duration-300 flex items-center 
                    justify-center py-2 text-[20px] bg-[#24a0ed] font-serif">
                   {!loading ? 
                    <span className="flex items-center">
                       Add image <ArrowUpTrayIcon className="brightness-100 h-6 w-6 ml-2"></ArrowUpTrayIcon> 
                    </span>
                    :
                     <img className="h-7 w-7 animate-spin" src='spinner.svg'></img>}
              </label>
              <span className="text-black/50">{pickedImage && pickedImage.name}</span>
              <input 
                   className="hidden"
                   //@ts-ignore
                   onChange={(e)=>{selectImage(e.target.files[0]); console.log(e.target.files[0])}}  
                   type='file'
                   accept="image/*"
                   id='imageUploadButton' />
              <button onClick={()=>uploadImage()} className={`${loading ? 'bg-black/10 cursor-default' : !pickedImage ? 'bg-black/10 cursor-default' : 'bg-black/90 cursor-pointer'} 
                 w-[40%] font-serif py-2 transition duration-300 rounded-md mt-5 flex justify-center`}>
                {!loading ? <span>Publish</span>: <img className="h-7 w-7 animate-spin" src='spinner.svg'></img>}
              </button>
         </div>
     )
}