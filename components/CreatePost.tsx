
import {storage} from '../lib/firebase'
import {useState, useEffect} from 'react'
import {ref, getDownloadURL, uploadBytes, deleteObject} from 'firebase/storage'
import {v4} from 'uuid'
import {ArrowUpTrayIcon, ChevronUpDownIcon} from '@heroicons/react/24/outline'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Swal from 'sweetalert2'
import {useRouter} from 'next/router'
import {XCircleIcon} from '@heroicons/react/24/solid'
import {baseUrl} from '../baseUrl'

export default function CreatePost(props:{setImageDisplay:any}){
    
    const session = useSession();
    const router = useRouter();

    const [currentRef, setCurrentRef] = useState<any>();
    const [pickedImage, setPickedImage] = useState<any>();
    const [loading, setLoading] = useState(false);

    const [examsList, setExamsList] = useState<any>();
    const [selectedExam, setSelectedExam] = useState<any>();
    useEffect(()=>{
        if(!examsList) axios({
          url:baseUrl+'api/examHandlers/getExamsList',
          method:'GET'
        }).then((res)=>{
             setExamsList([...res.data]);
             setSelectedExam(res.data[0]);
       
        }).catch((err)=>{
          console.log(err);
        })

    })
   
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
                    url:baseUrl+'api/handlers/publishPost',
                    data:{
                     imageUrl: image,
                     //@ts-ignore
                     session: JSON.stringify(session),
                     type:'image',
                     examId: selectedExam.id
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

    const [dropDownMenu, setDropDownMenu] = useState(false);

    const handleSelectExam=(item:any)=>{
      setSelectedExam(item);
      setDropDownMenu(false);
  }

    const selectImage= (value:any) =>{
        if(!value) return alert('You have to select picture!');
        setPickedImage(value);
    }

    const handleDropDownMenu=()=>{
      setDropDownMenu(prevDD=>!prevDD);
    }
    

    const handleClose= ()=>{
        props.setImageDisplay(false);
    }

     return(
         <div className="w-[90%] relative max-w-[400px] rounded-xl px-5 py-10 flex bg-white flex-col justify-center items-center z-20 text-white">
            <div className="absolute top-1 right-1 flex items-center justify-center cursor-pointer " onClick={()=>handleClose()}>
                <XCircleIcon className="w-8 h-8 brightness-0"></XCircleIcon>
              </div>
              <div id="examListImage" className={`h-full ${dropDownMenu? 'absolute' : 'hidden'} z-20 top-20 px-3 py-2 w-[80%] bg-[#eae3e3] backdrop-blur-md text-black/70`}>
                  {
                    examsList && examsList.map((item:any, idx:number)=>(
                      <div key={idx} onClick={()=>handleSelectExam(item)}  className="text-[20px] font-medium flex items-center truncate 
                     h-12 w-full transion duration-200 cursor-pointer rounded-lg hover:bg-slate-50 px-2">
                        <p className='truncate'>{item.title}</p>
                     </div> 
                    ))
                  }
            </div>
            {selectedExam && <div className="text-black/80 w-full mb-10 px-10 text-[21px] font-bold flex items-center">{selectedExam.title}
               <ChevronUpDownIcon onClick={()=>handleDropDownMenu()} className="w-8 h-8 cursor-pointer"></ChevronUpDownIcon>
             </div>}
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
                   onChange={(e)=>{selectImage(e.target.files[0]);}}  
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