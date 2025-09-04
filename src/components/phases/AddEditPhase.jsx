import React, { useRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Button, Input, Loader } from '../index';
import { IoMdCloseCircle } from "react-icons/io";
import { addPhaseFirebase } from '../../firebase/phaseServices/addPhaseService';
import { updatePhaseFirebase } from '../../firebase/phaseServices/updatePhaseService';

import { toast } from 'react-toastify';

function AddEditPhase({ onClose, onPhaseAdded, phaseData, editingMode }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm();
  const phaseNameValue = watch("phaseName");

  // Pre-fill form in edit mode
  useEffect(() => {
    if (editingMode && phaseData) {
      reset({
        phaseName: phaseData.label || "",
        phaseNameSlug: phaseData.value || "",
        phaseColor: phaseData.color || "#f2f3f5"
      });
    } else {
      reset({
        phaseName: "",
        phaseNameSlug: "",
        phaseColor: "#f2f3f5"
      });
    }
  }, [editingMode, phaseData, reset]);  
  
  const handlePhaseNameChange = (value) => {
    // update the input field
    setValue("phaseName", value);

    // generate slug
    const phaseNameSlug = value.toLowerCase().replace(/\s+/g, '-');
    setValue("phaseNameSlug", phaseNameSlug);
  };

  const backdropRef = useRef(null);

  const handleMouseDown = (e) => {
    setTimeout(() => {
      backdropRef.current.clickedOnBackdrop = e.target === backdropRef.current;
    }, 0);
  };

  const handleMouseUp = (e) => {
    if (backdropRef.current.clickedOnBackdrop && e.target === backdropRef.current) {
      onClose();
    }
  };
  
  const onSubmit = async (data) => {
    setLoading(true);
    const keywords = Array.from({ length: data.phaseName.length }, (_, i) => data.phaseName.toLowerCase().slice(0, i + 1));
    const cleaned ={
      label: data.phaseName,
      value: data.phaseNameSlug,
      keywords: keywords,
      color: data.phaseColor || "#f2f3f5"
    }
    try {
      let response;

      if (editingMode && phaseData?.id) {
        // Update existing phase
        response = await updatePhaseFirebase(phaseData.id, cleaned);
      } else {
        // Add new phase
        response = await addPhaseFirebase(cleaned);
      }
      if(response.success){
        toast.success(`Phase ${cleaned.label} ${editingMode ? "Updated" : "Created"} Successfully`);
        onPhaseAdded?.();
        setLoading(false);
        onClose();
        reset();
      }
    } catch (error) {
      console.error("Error saving phase:", error);
      setLoading(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      className='fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-center cursor-pointer'
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div
        className='bg-white w-96 h-fit flex flex-col p-4 cursor-auto'
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        <div className='flex justify-end mb-2'>
          <button onClick={onClose}><IoMdCloseCircle className='text-2xl' /></button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          {editingMode ? "Edit Phase" : "Add Phase"}
        </h2>

        {loading ? (
          <div className='flex justify-center mt-10'>
            <Loader color='text-blue' height='h-64' />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            {/* Phase Name Input */}
            <Input
              label="Phase Name"
              placeholder="Enter Phase Name"
              {...register("phaseName", { required: "Phase name is required" })}
              onChange={(e) => handlePhaseNameChange(e.target.value)}
              value={watch("phaseName") ?? ""}
              error={errors.phaseName && errors.phaseName.message}
            />

            {/* Slug Input (readonly) */}
            <Input
              label="Slug"
              placeholder="Auto-generated Phase Name"
              {...register("phaseNameSlug")}
              disabled
              className='text-gray-500'
            />

            {/* Color Picker */}
            <div className=''>
              <label className="block">
                Phase Color
              </label>
              <input
                type="color"
                {...register("phaseColor", { required: "Color is required" })}
                className="w-full h-8  rounded cursor-pointer"
                defaultValue={editingMode && phaseData?.color ? phaseData.color : "#000000"}
              />
              {errors.phaseColor && (
                <p className="text-red-500 text-xs mt-1">{errors.phaseColor.message}</p>
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

export default AddEditPhase
