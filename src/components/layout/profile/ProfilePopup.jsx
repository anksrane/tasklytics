import React, {useRef, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { Input, ButtonWithIcon, Button } from "../../index";
import { FaPenToSquare, FaEye } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";
import { setIsProfilePopupOpen } from '../../../features/ui/profilePopupSlice';
import { updateProfileFirebase } from '../../../firebase/authServices/updateProfileService';
import { setUser } from "../../../features/auth/authSlice";
import { toast } from "react-toastify";

function ProfilePopup({isOpen}) {
    const dispatch = useDispatch();
    const backdropRef = useRef(null);
    const {user} = useSelector((state)=>state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, reset, formState:{ errors, isSubmitting }, } = useForm({
        defaultValues: {
            name: user.name,
            email: user.email,
            role: user.userRole,
            manager: user.manager,
            managers:user.managers && user.managers.name ? user.managers.name : "",
            mobileNo:user.mobileNo
        },
    }); 
    
    const toggleEdit=()=>{
        setIsEditing(!isEditing);
    }

    const onSubmit = async (data) => {
      const cleaned ={
        email: user.email,
        id:user.id,
        userName: data.name,
        mobileNo: data.mobileNo,
        userRole: data.role,
        manager: user.manager,
        managers: user.managers
      }      
      try {
        const result = await updateProfileFirebase(cleaned);
        if(result.success){
          dispatch(
            setUser({
              ...user,               
              name: cleaned.userName,
              mobileNo: cleaned.mobileNo,
              userRole: cleaned.userRole,
              manager: cleaned.manager,
              managers: cleaned.managers,
            })
          );  
        }      
        toast.success(
          `Profile updated.`
        );
        setIsEditing(false);
        reset;
        dispatch(setIsProfilePopupOpen(false));
        // update redux auth state if needed
      } catch (err) {
        toast.error("Failed to update profile. Try again.");
        console.error(err);
      }
    };      

    const editIcon=<FaPenToSquare />;

    // Popup Close click outside
    const handleMouseDown = (e) => {
      setTimeout(() => {
        backdropRef.current.clickedOnBackdrop = e.target === backdropRef.current;
      }, 0);
    };

    // Popup Close click outside
    const handleMouseUp = (e) => {
      if (backdropRef.current.clickedOnBackdrop && e.target === backdropRef.current) {
        setIsEditing(false);
        dispatch(setIsProfilePopupOpen(false));
      }
    };  

    const closeClicked = () =>{
        setIsEditing(false);
        dispatch(setIsProfilePopupOpen(false));      
    }
    return (
      <div
        ref={backdropRef}
        className={isOpen ? 'fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-center cursor-pointer':'hidden'}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div
          className='bg-white sm:w-96 w-auto h-fit flex flex-col p-4 cursor-auto rounded-md'
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        >
          <div className="">
              <div className='flex justify-end mb-2'>
                <button onClick={()=>{closeClicked()}}><IoMdCloseCircle className='text-2xl' /></button>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">{isEditing? "Edit Profile" : "View Profile"}</h2>
              <div className=''>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-4">
                      {/* <div className='w-[40%] flex flex-col items-center'>
                          <div className='border-4 border-[#7e7d7d] rounded-full max-w-[200px]'>
                              <img src={profileDummy} alt="Profile Dummy Image" className='max-w-full h-auto' />
                          </div>
                      </div> */}
                      <div className="w-full">
                              {/* Name of User */}
                              <div className="">
                                  <Input 
                                      label="Name"
                                      placeholder="Enter Name"
                                      type="text"
                                      className="py-1 px-2 text-sm"
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

                              {/* Mobile No of User */}
                              <div className="">
                                  <Input 
                                      label="Mobile Number"
                                      placeholder="Enter Mobile Number"
                                      type="text"
                                      className="py-1 px-2 text-sm"
                                      labelClass='font-semibold mt-2'
                                      disabled={!isEditing}
                                      {...register("mobileNo", {
                                          required: "Mobile Number is required",
                                          pattern: {
                                              value: /^[0-9]{10}$/,
                                              message: "Mobile number must be exactly 10 digits"
                                          }
                                      })}
                                      error={errors.mobileNo && errors.mobileNo.message}
                                  />  
                              </div>     
                              {/* Mobile No of User */}  

                              {/* Role of User */}
                              <div className="">
                                  <Input 
                                      label="Role"
                                      placeholder="Enter Role"
                                      type="text"
                                      className="py-1 px-2 text-sm"
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
                                      className="py-1 px-2 text-sm"
                                      labelClass='font-semibold  mt-2'
                                      disabled={true}
                                      {...register("email", {
                                          required: "Email is required",
                                          pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Please enter a valid email address"
                                          }
                                      })}
                                      error={errors.email && errors.email.message}
                                  />  
                              </div>     
                              {/* email of User */}           

                              {/* Manager of User */}
                              {user.managers && user.managers.name!=="" ?(
                                  <div className="">
                                      <Input 
                                          label="Manager Name"
                                          placeholder="Enter Manager Name"
                                          type="text"
                                          className="py-1 px-2 text-sm"
                                          labelClass='font-semibold  mt-2'
                                          disabled={true} 
                                          {...register("managers", {
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
                      </div>  
                    </div>
                      {/* Buttons */}
                        {isEditing? (
                          <div className='flex justify-center gap-2 my-3'>
                              <Button type="submit" variant='primary' className='py-2 text-sm' isLoading={isSubmitting}>
                                  {isSubmitting ? 'Saving...' : 'Save'}
                              </Button>
                              <Button type="button" variant='secondaryOutline' className='py-2 text-sm' onClick={()=>{setIsEditing(false)}}>
                                  Cancel
                              </Button>
                          </div>  
                        ):
                        (
                          <div className='flex justify-center gap-2 my-3'>
                            <ButtonWithIcon icon={editIcon} iconClass={'text-xl font-bold'} iconPosition="left" variant="primary" className='text-sm mt-2' onClick={()=>toggleEdit()}>
                                Edit Profile
                            </ButtonWithIcon>       
                          </div>                               
                        )
                      }                       
                  </form>
              </div>
          </div>
        </div>
      </div>
    )
}

export default ProfilePopup
