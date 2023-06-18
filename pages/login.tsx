
import { getSession } from 'next-auth/react';
import LoginForm from '../components/LoginForm'
import {useRouter} from 'next/router';

export default function Login(stg:any){
    const router = useRouter();
    
    return(
         <div className="w-full relative h-screen bg-red-700 flex flex-col items-center font-serif">
           <div className=" text-[55px] sm:text-[80px] md:text-[95px] lg:text-[110px] text-white">Slide&Rate</div>
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