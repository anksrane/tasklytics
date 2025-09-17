import React, { useRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Button, Input, Loader } from '../index';
import { IoMdCloseCircle } from "react-icons/io";
import { addStatusFirebase } from '../../firebase/statusServices/addStatusService.js';
import { updateStatusFirebase } from '../../firebase/statusServices/updateStatusService.js';

import { toast } from 'react-toastify';

function AddEditStatus({ onClose, onStatusAdded, statusData, editingMode }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm();
  const statusNameValue = watch("statusName");

  // Pre-fill form in edit mode
  useEffect(() => {
    if (editingMode && statusData) {
      reset({
        statusName: statusData.label || "",
        statusNameSlug: statusData.value || "",
        statusColor: statusData.color || "#f2f3f5"
      });
    } else {
      reset({
        statusName: "",
        statusNameSlug: "",
        statusColor: "#f2f3f5"
      });
    }
  }, [editingMode, statusData, reset]);  
  
  const handleStatusNameChange = (value) => {
    // update the input field
    setValue("statusName", value);

    // generate slug
    const statusNameSlug = value.toLowerCase().replace(/\s+/g, '-');
    setValue("statusNameSlug", statusNameSlug);
  };

  const backdropRef = useRef(null);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };  
  
  const onSubmit = async (data) => {
    setLoading(true);
    const keywords = Array.from({ length: data.statusName.length }, (_, i) => data.statusName.toLowerCase().slice(0, i + 1));
    const cleaned ={
      label: data.statusName,
      value: data.statusNameSlug,
      keywords: keywords,
      color: data.statusColor || "#f2f3f5"
    }
    try {
      let response;

      if (editingMode && statusData?.id) {
        // Update existing status
        response = await updateStatusFirebase(statusData.id, cleaned);
      } else {
        // Add new status
        response = await addStatusFirebase(cleaned);
      }
      if(response.success){
        toast.success(`Status ${cleaned.label} ${editingMode ? "Updated" : "Created"} Successfully`);
        onStatusAdded?.();
        setLoading(false);
        onClose();
        reset();
      }
    } catch (error) {
      console.error("Error saving status:", error);
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
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className='flex justify-end mb-2'>
          <button onClick={onClose}><IoMdCloseCircle className='text-2xl' /></button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          {editingMode ? "Edit Status" : "Add Status"}
        </h2>

        {loading ? (
          <div className='flex justify-center mt-10'>
            <Loader color='text-blue' height='h-64' />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            {/* Status Name Input */}
            <Input
              label="Status Name"
              placeholder="Enter Status Name"
              {...register("statusName", { required: "Status name is required" })}
              onChange={(e) => handleStatusNameChange(e.target.value)}
              value={watch("statusName") ?? ""}
              error={errors.statusName && errors.statusName.message}
            />

            {/* Slug Input (readonly) */}
            <Input
              label="Slug"
              placeholder="Auto-generated Status Name"
              {...register("statusNameSlug")}
              disabled
              className='text-gray-500'
            />

            {/* Color Picker */}
            <div className=''>
              <label className="block">
                Status Color
              </label>
              <input
                type="color"
                {...register("statusColor", { required: "Color is required" })}
                className="w-full h-8  rounded cursor-pointer"
                defaultValue={editingMode && statusData?.color ? statusData.color : "#000000"}
              />
              {errors.statusColor && (
                <p className="text-red-500 text-xs mt-1">{errors.statusColor.message}</p>
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

export default AddEditStatus
