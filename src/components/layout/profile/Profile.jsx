import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { Input, ButtonWithIcon, Button } from "../../index";
import { FaPenToSquare, FaEye } from "react-icons/fa6";
import profileDummy from '../../../assets/profile-icon.png';

function Profile() {
    const {user} = useSelector((state)=>state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, reset, formState:{ errors, isSubmitting }, } = useForm({
        defaultValues: {
            name: user.name,
            email: user.email,
            password: "",
            role: user.userRole,
            manager:user.managers && user.managers.name ? user.managers.name : "",
        },
    });    

    const toggleEdit=()=>{
        setIsEditing(!isEditing);
    }

    const onSubmit = (data) => {
        console.log("Updated Profile:", data);
        setIsEditing(false);
    };    

    const editIcon=<FaPenToSquare />;
    const viewIcon=<FaEye />;
    return (
        <div className="mx-auto p-4 z-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
            <div className='w-[50%] m-auto'>
                {/* Edit View Buttons */}
                <div className="flex justify-end gap-1 py-2">
                    {isEditing ? (
                        <ButtonWithIcon icon={viewIcon} iconClass={'text-xl font-bold'} iconPosition="left" variant="primary" className='text-sm mt-0' onClick={()=>toggleEdit()}>
                            View Profile
                        </ButtonWithIcon>                         
                    ) : (
                        <ButtonWithIcon icon={editIcon} iconClass={'text-xl font-bold'} iconPosition="left" variant="primary" className='text-sm mt-0' onClick={()=>toggleEdit()}>
                            Edit Profile
                        </ButtonWithIcon>                         
                    )}
                </div>

                <form className='flex gap-4' onSubmit={handleSubmit}>
                    <div className='w-[40%] flex flex-col items-center'>
                        <div className='border-4 border-[#7e7d7d] rounded-full max-w-[200px]'>
                            <img src={profileDummy} alt="Profile Dummy Image" className='max-w-full h-auto' />
                        </div>
                    </div>
                    <div className="w-[60%]">
                            {/* Name of User */}
                            <div className="">
                                <Input 
                                    label="Name"
                                    placeholder="Enter Name"
                                    type="text"
                                    className="py-1 text-sm"
                                    labelClass='font-semibold mt-2'
                                    disabled={!isEditing}
                                    {...register("name", {
                                        required: "Name",
                                        pattern: {
                                            value: /^[a-zA-Z0-9 _.-]{1,100}$/,
                                            message: "Title can only contain letters, numbers, spaces, -, _, and ."
                                        }
                                    })}
                                    error={errors.name && errors.name.message}
                                />  
                            </div>     
                            {/* Name of User */}  

                            {/* Role of User */}
                            <div className="">
                                <Input 
                                    label="Role"
                                    placeholder="Enter Role"
                                    type="text"
                                    className="py-1 text-sm"
                                    labelClass='font-semibold mt-2'
                                    disabled={true} 
                                    {...register("role", {
                                        required: "Role",
                                        pattern: {
                                            value: /^[a-zA-Z0-9 _.-]{1,100}$/,
                                            message: "Title can only contain letters, numbers, spaces, -, _, and ."
                                        },
                                    })}
                                    error={errors.role && errors.role.message}
                                />  
                            </div>     
                            {/* Role of User */}                                                   

                            {/* email of User */}
                            <div className="">
                                <Input 
                                    label="Email"
                                    placeholder="Enter Name"
                                    type="text"
                                    className="py-1 text-sm"
                                    labelClass='font-semibold  mt-2'
                                    disabled={!isEditing}
                                    {...register("email", {
                                        required: "Email",
                                        pattern: {
                                            value: /^[a-zA-Z0-9 _.-]{1,100}$/,
                                            message: "Title can only contain letters, numbers, spaces, -, _, and ."
                                        }
                                    })}
                                    error={errors.email && errors.email.message}
                                />  
                            </div>     
                            {/* email of User */}           

                            {/* Manager of User */}
                            {user.managers.name?(
                                <div className="">
                                    <Input 
                                        label="Manager Name"
                                        placeholder="Enter Manager Name"
                                        type="text"
                                        className="py-1 text-sm"
                                        labelClass='font-semibold  mt-2'
                                        disabled={true} 
                                        {...register("manager", {
                                            required: "Manager",
                                            pattern: {
                                                value: /^[a-zA-Z0-9 _.-]{1,100}$/,
                                                message: "Title can only contain letters, numbers, spaces, -, _, and ."
                                            }
                                        })}
                                        error={errors.email && errors.email.message}
                                    />  
                                </div>           
                            ):""}                    
                            {/* Manager of User */}   
                            
                            {/* Buttons */}
                            {isEditing? (
                                <div className='flex justify-center gap-2 my-3'>
                                    <Button type="submit" variant='primary' className='py-2 text-sm' isLoading={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : 'Save'}
                                    </Button>
                                    <Button type="button" variant='danger' className='py-2 text-sm'>
                                        Cancel
                                    </Button>
                                </div>  
                            ):""}                                                
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Profile
