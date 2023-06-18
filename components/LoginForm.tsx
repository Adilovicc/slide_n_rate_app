import { InputLabel, InputAdornment, IconButton, OutlinedInput, FormControl, TextField } from "@mui/material"
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signIn } from "next-auth/react";
import {useForm} from 'react-hook-form'

import {useState} from 'react'
import { useRouter } from "next/router";

export default function Signin(){
    const {register, handleSubmit, formState:{errors}, reset } = useForm();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [statusError, setStatusError] = useState(false);
    const handleClickShowPassword = () =>{
        setShowPassword(prevShowPass => !prevShowPass);
    }
    
    const handleSignIn = async (values:any) =>{
        setStatusError(false);
        const {password, email} = values;
        const status = await signIn('credentials', {redirect:false, email:email, password:password});  
        if(status?.error){
             return setStatusError(true);
        }
        setStatusError(false)
        reset();
        if(status) return router.push('/');
  }

    return(
        <form onSubmit={handleSubmit(handleSignIn)} className="w-[95%] border-[0.5px] border-black/40 max-w-[450px] py-[5px] pb-[40px] bg-white rounded-md shadow-md flex flex-col items-center px-3 text-center">
             <span className="text-xl font-serif my-3">Login</span>
             {statusError &&  <span className=" text-red-700 mb-5 font-serif border-[0.5px] border-red-700/80">Login failed! Email or password incorrect. Try again please.</span>}
             <TextField
                className="!w-full !my-1"
                id="outlined-basic"
                size='small'
                label="Email"
                required
                autoComplete="current-password"
                {...register("email", 
                       {required: true,
                        pattern:{
                            value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message:"Format: johndoe@gmail.com etc..."}} )}
              />
             
             <FormControl size="small" className="w-full !my-1" variant="outlined">
             <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
               <OutlinedInput
                 id="outlined-adornment-password"
                 type={showPassword ? 'text' : 'password'}
                 {...register("password",{required:true,minLength:6})}
                 endAdornment={
                 <InputAdornment position="end">
                   <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                   </IconButton>
                 </InputAdornment>
                 }
                label="Password"
            />
           </FormControl>
           <div className="w-full flex text-sm pl-1 text-[rgb(22,51,81)]"><label className="cursor-pointer">Forgot password?</label></div>
           <button type="submit" className="w-[80%] mt-8 h-10 bg-[rgb(49,188,230)] text-white text-lg font-semibold rounded-md">
                Login
           </button>
        </form>
    )
}