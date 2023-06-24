
import { getSession } from 'next-auth/react';
import LoginForm from '../components/LoginForm'
import {useRouter} from 'next/router';

export default function Login(stg:any){
    const router = useRouter();
    
    return(
         <div className="w-full relative h-screen bg-[#40bbc7] flex flex-col  items-center font-serif overflow-hidden">
           <div className=" mt-20 text-[55px] sm:text-[80px] md:text-[95px] lg:text-[110px] text-white">Answer&Slide</div>
           <LoginForm></LoginForm>
         </div>

    )

}


export const getServerSideProps = async (context:any) => {
    const session = await getSession(context);

    if(session){
      return{
        redirect: {
            destination: '/',
            permanent: false,
          },
      }
    }

    return {
        props:{
            stg:null
        }
    };
   
};