import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { XCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Swal from 'sweetalert2';
import {baseUrl} from '../baseUrl'

export default function GenerateUser(props:{setGenerateScreen:any}) {
  const { register, handleSubmit, formState: { errors }, setValue} = useForm();
  const [inputModified, setInputModified] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = (data:any) => {
    console.log(data);
    console.log(inputModified);
    
        let cancel: () => void = () => {};
            setLoading(true);
            try {
              axios({
                method:'GET',
                url:baseUrl+'api/handlers/generateUser',
                params: {
                    username:data.text,
                    emailBase:inputModified,
                },
                cancelToken: new axios.CancelToken(c=>cancel=c)
              }).then(res => {
                console.log(res.data);
                props.setGenerateScreen(false);
                const emailCred = `Email: ${res.data.email}`;
                const pwCred = `Password: ${res.data.password}`;
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'New user has been created!',
                    html: `${emailCred}<br>${pwCred}`,
                    showConfirmButton: true,
                 });
                setLoading(false);
              }).catch(
                err=> {
                    if(axios.isCancel(err)) return
                    props.setGenerateScreen(false);
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Something went wrong',
                        showConfirmButton: true,
                        timer: 4000
                     });
                }
              )
              
            } catch (error) {
             
            }
  };

 

  const handleInputChange = (e:any) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    const convertedValue = fieldValue.replace(/\s/g, '').toLowerCase();
    setInputModified(convertedValue);
    console.log(inputModified);
    setValue(fieldName, fieldValue);
  };

  return (
  <div className="max-w-[360px] w-full relative px-10 bg-white rounded-md border-[0.5px] border-black/30">  
     <div onClick={()=>props.setGenerateScreen(false)} className="absolute top-1 right-1 flex items-center justify-center cursor-pointer">
            <XCircleIcon className="w-8 h-8"></XCircleIcon>
        </div>
    <form onSubmit={handleSubmit(onSubmit)} className="flex relative flex-col justify-center items-center p-5 pt-10">
       
        <label className="font-serif">Enter name of the user: </label>
        <input
          className="border-black/30 border-[0.5px] rounded-md decoration-transparent h-10 w-full px-2 outline-none"
          type="text"
          {...register('text', {
            required: 'This field is required',
            maxLength: {
              value: 25,
              message: 'Maximum length is 25 characters',
            },
            pattern: {
              value: /^[A-Za-z0-9\s]*$/,
              message: 'Invalid input',
            },
          })}
          onChange={(e)=>handleInputChange(e)}
        />              
        {errors.text && 
         //@ts-ignore
        <span className="text-sm text-red-600 font-serif">{errors.text.message}</span>}
    
      <button className="px-4 py-1 mt-4 text-white font-semibold flex justify-center items-center rounded-md bg-[#2473e2]" type="submit">Generate</button>
    </form>
  </div>
  );
}

