import React, { useRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Button, Input, Loader } from '../index';
import { IoMdCloseCircle } from "react-icons/io";
import { addClientFirebase } from '../../firebase/clientServices/addClientService';
import { updateClientFirebase } from '../../firebase/clientServices/updateClientService';

import { toast } from 'react-toastify';

function AddEditClient({ onClose, onClientAdded, clientData, editingMode }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm();
  const clientNameValue = watch("clientName");

  // Pre-fill form in edit mode
  useEffect(() => {
    if (editingMode && clientData) {
      reset({
        clientName: clientData.label || "",
        clientNameSlug: clientData.value || ""
      });
    } else {
      reset({
        clientName: "",
        clientNameSlug: ""
      });
    }
  }, [editingMode, clientData, reset]);  
  
  const handleClientNameChange = (value) => {
    // update the input field
    setValue("clientName", value);

    // generate slug
    const clientNameSlug = value.toLowerCase().replace(/\s+/g, '-');
    setValue("clientNameSlug", clientNameSlug);
  };

  const backdropRef = useRef(null);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };  
  
  const onSubmit = async (data) => {
    setLoading(true);
    const keywords = Array.from({ length: data.clientName.length }, (_, i) => data.clientName.toLowerCase().slice(0, i + 1));
    const cleaned ={
      label: data.clientName,
      value: data.clientNameSlug,
      keywords: keywords
    }
    try {
      let response;

      if (editingMode && clientData?.id) {
        // Update existing client
        response = await updateClientFirebase(clientData.id, cleaned);
      } else {
        // Add new client
        response = await addClientFirebase(cleaned);
      }
      if(response.success){
        toast.success(`Client ${cleaned.label} ${editingMode ? "Updated" : "Created"} Successfully`);
        onClientAdded?.();
        setLoading(false);
        onClose();
        reset();
      }
    } catch (error) {
      console.error("Error saving client:", error);
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
          {editingMode ? "Edit Client" : "Add Client"}
        </h2>

        {loading ? (
          <div className='flex justify-center mt-10'>
            <Loader color='text-blue' height='h-64' />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            {/* Client Name Input */}
            <Input
              label="Client Name"
              placeholder="Enter Client Name"
              className="py-1 px-2 text-sm"
              labelClass='font-semibold mt-2'
              {...register("clientName", { required: "Client name is required" })}
              onChange={(e) => handleClientNameChange(e.target.value)}
              value={watch("clientName") ?? ""}
              error={errors.clientName && errors.clientName.message}
            />

            {/* Slug Input (readonly) */}
            <Input
              label="Slug"
              placeholder="Auto-generated Client Name"
              className="py-1 px-2 text-sm"
              labelClass='font-semibold mt-2'              
              {...register("clientNameSlug")}
              disabled
            />

            {/* Buttons */}
            <div className='flex justify-center gap-2 my-3'>
              <Button type="submit" variant='primary' className='py-2 text-sm' isLoading={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant='secondaryOutline' className='py-2 text-sm' onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default AddEditClient
