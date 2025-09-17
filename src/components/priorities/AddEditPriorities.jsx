import React, { useRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Button, Input, Loader } from '../index';
import { IoMdCloseCircle } from "react-icons/io";
import { addPriorityFirebase } from '../../firebase/priorityServices/addPriorityService';
import { updatePriorityFirebase } from '../../firebase/priorityServices/updatePriorityService';

import { toast } from 'react-toastify';

function AddEditPriorities({ onClose, onPriorityAdded, priorityData, editingMode }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm();
  const priorityNameValue = watch("priorityName");

  // Pre-fill form in edit mode
  useEffect(() => {
    if (editingMode && priorityData) {
      reset({
        priorityName: priorityData.label || "",
        priorityNameSlug: priorityData.value || "",
        priorityColor: priorityData.color || "#f2f3f5"
      });
    } else {
      reset({
        priorityName: "",
        priorityNameSlug: "",
        priorityColor: "#f2f3f5"
      });
    }
  }, [editingMode, priorityData, reset]);  
  
  const handlePriorityNameChange = (value) => {
    // update the input field
    setValue("priorityName", value);

    // generate slug
    const priorityNameSlug = value.toLowerCase().replace(/\s+/g, '-');
    setValue("priorityNameSlug", priorityNameSlug);
  };

  const backdropRef = useRef(null);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };  
  
  const onSubmit = async (data) => {
    setLoading(true);
    const keywords = Array.from({ length: data.priorityName.length }, (_, i) => data.priorityName.toLowerCase().slice(0, i + 1));
    const cleaned ={
      label: data.priorityName,
      value: data.priorityNameSlug,
      keywords: keywords,
      color: data.priorityColor || "#f2f3f5"
    }
    try {
      let response;

      if (editingMode && priorityData?.id) {
        // Update existing priority
        response = await updatePriorityFirebase(priorityData.id, cleaned);
      } else {
        // Add new priority
        response = await addPriorityFirebase(cleaned);
      }
      if(response.success){
        toast.success(`Priority ${cleaned.label} ${editingMode ? "Updated" : "Created"} Successfully`);
        onPriorityAdded?.();
        setLoading(false);
        onClose();
        reset();
      }
    } catch (error) {
      console.error("Error saving priority:", error);
      setLoading(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      className='fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-center cursor-pointer'
      onClick={handleBackdropClick}
    >
      <div
        className='bg-white w-96 h-fit flex flex-col p-4 cursor-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-end mb-2'>
          <button onClick={onClose}><IoMdCloseCircle className='text-2xl' /></button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          {editingMode ? "Edit Priority" : "Add Priority"}
        </h2>

        {loading ? (
          <div className='flex justify-center mt-10'>
            <Loader color='text-blue' height='h-64' />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            {/* Priority Name Input */}
            <Input
              label="Priority Name"
              placeholder="Enter Priority Name"
              {...register("priorityName", { required: "Priority name is required" })}
              onChange={(e) => handlePriorityNameChange(e.target.value)}
              value={watch("priorityName") ?? ""}
              error={errors.priorityName && errors.priorityName.message}
            />

            {/* Slug Input (readonly) */}
            <Input
              label="Slug"
              placeholder="Auto-generated Priority Name"
              {...register("priorityNameSlug")}
              disabled
              className='text-gray-500'
            />

            {/* Color Picker */}
            <div className=''>
              <label className="block">
                Priority Color
              </label>
              <input
                type="color"
                {...register("priorityColor", { required: "Color is required" })}
                className="w-full h-8  rounded cursor-pointer"
                defaultValue={editingMode && priorityData?.color ? priorityData.color : "#000000"}
              />
              {errors.priorityColor && (
                <p className="text-red-500 text-xs mt-1">{errors.priorityColor.message}</p>
              )}
            </div>            

            {/* Buttons */}
            <div className='flex justify-center gap-2 my-3'>
              <Button type="submit" variant='primary' className='py-2 text-sm' isLoading={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant='danger' className='py-2 text-sm' onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default AddEditPriorities
