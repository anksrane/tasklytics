import React from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input } from '../index';
import { loginUser } from '../../features/auth/authActions'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import img from "../../assets/side-image.jpg"

function Login() {
    const { 
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        } = useForm();

    const dispatch=useDispatch();
    const navigate=useNavigate();

    const {error,user}=useSelector((state)=>state.auth);

    useEffect(()=>{
        if(user){
            navigate('/dashboard');
        }
    },[user,navigate])

    const login = async (data) => {
        const cleaned = {
            email: data.email.trim(),
            password: data.password.trim()
        };

        const result=await dispatch(loginUser(cleaned.email,cleaned.password));
        console.log(result);
    };
    return (
        <div className='relative flex items-center justify-center h-screen w-screen overflow-hidden p-1 md:p-0'>

            <div className="relative z-30 w-full max-w-4xl md:shadow-md rounded-md border border-secondary flex">
                <div className='hidden md:block md:w-1/2'>
                    <img src={img} alt="Banne Image" className='rounded-tl-md rounded-bl-md' />
                </div>
                <div className='bg-background-surface md:p-8 px-5 py-8 md:w-1/2 m-auto md:m-0 flex flex-col justify-center md:rounded-tr-md md:rounded-br-md md:rounded-none rounded-md'>
                    <h2 className="text-3xl font-bold mb-8 text-center text-primary">Login to<span className='font-[900] bg-gradient-to-r from-primary via-secondary to-primary
                    bg-clip-text text-transparent 
                    bg-[length:200%_100%] animate-gradient-x'> Tasklytics</span>
                        </h2>
                    <form onSubmit={handleSubmit(login)} className="space-y-4">
                        <Input 
                            label="Email: "
                            placeholder="Enter your Email"
                            type="email"
                            className="p-2"
                            {...register("email", {
                                required: "Email is Required",
                                pattern: {
                                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                    message: "Invalid email address"
                                }
                            })}
                            error={errors.email && errors.email.message}
                        />
                        <Input 
                            label="Password: "
                            placeholder="Enter your Password"
                            type="password"
                            className="p-2"
                            {...register("password", {
                                required: "Password is Required",
                                minLength:  {
                                                value: 6,
                                                message: "Password must be at least 6 characters"
                                            }   
                            })}
                            error={errors.password && errors.password.message}
                        />
                        <div className='flex gap-2'>
                            <Button type="submit" 
                            variant='primary' className='w-full py-2'
                            isLoading={isSubmitting}>Login</Button>
                            <Button type="reset" 
                            variant='secondaryOutline' className='w-full py-2'
                            onClick={()=>reset()}>Reset</Button>
                        </div>
                        {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center text-sm">
                            {error}
                        </div>
                        )}                    
                    </form>
                </div>
            </div>
        
        </div>
    )
}

export default Login