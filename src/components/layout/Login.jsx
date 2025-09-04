import React from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input } from '../index';
import { loginUser } from '../../features/auth/authActions'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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
        <div className='flex flex-col items-center justify-center h-screen'>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit(login)} className="space-y-4">
                    <Input 
                        label="Email: "
                        placeholder="Enter your Email"
                        type="email"
                        className="py-2"
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
                        className="py-2"
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
                        variant='danger' className='w-full py-2'
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
    )
}

export default Login