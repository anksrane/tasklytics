import React, { useRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, DatePicker, MultiSelect_Tag, Loader } from '../index';
import { IoMdCloseCircle } from "react-icons/io";
import { useSelector } from 'react-redux';
import { getCodersList } from '../../firebase/codersService';
import { addTaskFirebase } from '../../firebase/taskServices/addTaskService';
import { updateTaskFirebase } from '../../firebase/taskServices/updateTaskService';
import { toast } from 'react-toastify';
import { Timestamp } from "firebase/firestore";

function AddTask({onClose, singleTask, editingMode, onTaskAdded, taskPhasesOptions, taskPrioritiesOptions, statusesOptions, clientOptions }) {
    const {user}=useSelector((state)=>state.auth);
    const [codersOptions, setCodersOptions] = useState([]);
    const [coders, setCoders] = useState([]);
    const [loading,setLoading] = useState(true);

    const {
      register,
      handleSubmit,
      reset,
      watch,
      formState:{ errors, isSubmitting },
    } = useForm();
    const startDateValue = watch("startDate");    

    const formatDate = (val) => val?.toDate?.().toISOString().slice(0, 10) || "";

    useEffect(()=>{
      async function fetchCoders() {
        let coders = [];

        try {
          const result = await getCodersList(user);
          coders = result; // do not directly set here
          setCoders(coders);
          let codersDropdown=coders.map( (coder) => ({
            label: coder.userName,
            value: coder.id            
          }))
          setCodersOptions(codersDropdown);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch coders:", error);
        }
      }

      fetchCoders();
    },[])

    useEffect(() => {
      if (editingMode && singleTask) {
        reset({
          title: singleTask.title || '',
          description: singleTask.description || '',
          taskPhase: singleTask.taskPhase || '',
          taskStatus: singleTask.taskStatus || '',
          startDate: formatDate(singleTask.startDate) || '',
          endDate: formatDate(singleTask.endDate) || '',
          priority: singleTask.priority || '',
          coders: singleTask.coders?.map(coder => coder.id) || [],
          client: singleTask.client || '',
        });
        setLoading(false);
      }
    }, [editingMode, singleTask, reset]);    

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

    // Date Function
    const setDayStart = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      date.setHours(0, 0, 0, 0); // start of the day
      return Timestamp.fromDate(date);
    };

    const setDayEnd = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      date.setHours(23, 59, 59, 999); // end of the day
      return Timestamp.fromDate(date);
    };    

    const onSubmit = async (data) => {
      setLoading(true);

        const generateKeywords = (...args) => {
          const processPhrase = (phrase) => {
            const cleaned = phrase
              .toLowerCase()
              .replace(/[-_]/g, ' ')           // Replace - and _ with space
              .replace(/[^\w\s]/gi, '');       // Remove punctuation

            const words = cleaned.split(/\s+/).filter(w => w.length > 1);
            const keywords = new Set(words);

            // Incremental space-joined combinations (like n-grams)
            for (let i = 0; i < words.length; i++) {
              let combined = words[i];
              for (let j = i + 1; j < words.length; j++) {
                combined += ' ' + words[j];
                keywords.add(combined);
              }
            }

            // Full joined version (no spaces)
            if (words.length > 1) {
              keywords.add(words.join(''));
            }

            return Array.from(keywords);
          };

          const allKeywords = args.flatMap(arg => {
            if (typeof arg === 'string') {
              return processPhrase(arg);
            }

            // Handle array of objects like selectedCoders
            if (Array.isArray(arg)) {
              return arg.flatMap(item => {
                if (typeof item === 'string') return processPhrase(item);
                if (typeof item?.name === 'string') return processPhrase(item.name);
                return [];
              });
            }

            return [];
          });

          return Array.from(new Set(allKeywords));
        };

        let selectedCoders;
        if(user.userRole=="Coder"){
          selectedCoders = [{ id: user.id, name: user.name }];
        }else{
          selectedCoders = data.coders.map(coderId => {
            const match = codersOptions.find(opt => opt.value === coderId);
            return { id: coderId, name: match?.label || "" };
          }); 
        }   
        
        const cleaned = {
            title: data.title.trim(),
            description: data.description.trim(),
            taskPhase: data.taskPhase.trim(),
            taskStatus: data.taskStatus.trim(),
            startDate: setDayStart(data.startDate),
            endDate: setDayEnd(data.endDate),           
            priority: data.priority.trim(),
            coders: selectedCoders,   
            coderIds: selectedCoders.map(c => c.id),
            client:data.client,
            createdBy:user.id,
            updatedBy:user.id,
            createdByName:user.name,
            updatedByName:user.name,    
            managerId: (() => {
              if (user.userRole === "Manager") {
                return [user.id];
              } else if (user.userRole === "Admin") {
                // collect unique manager IDs from selected coders
                const selectedManagerIds = new Set();
                selectedCoders.forEach(coder => {
                  const coderObj = coders.find(c => c.id === coder.id);
                  if (coderObj?.manager) {
                    const managers = Array.isArray(coderObj.manager) ? coderObj.manager : [coderObj.manager];
                    managers.forEach(m => selectedManagerIds.add(m));
                  }
                });
                return Array.from(selectedManagerIds); // unique manager IDs
              } else {
                // if Coder, fallback to their own manager(s)
                return Array.isArray(user.manager) ? user.manager : [user.manager];
              }
            })(),                  
            trash:false
        };

        if (editingMode && singleTask) {
          cleaned.id = singleTask.id; // required for update
          cleaned.createdBy = singleTask.createdBy;
          cleaned.createdByName = singleTask.createdByName;
          const newKeywords = generateKeywords(cleaned.title, cleaned.client, selectedCoders);
          cleaned.keywords = singleTask.serialNo.toLowerCase() 
              ? Array.from(new Set([...newKeywords, singleTask.serialNo.toLowerCase()]))
              : newKeywords;
          console.log("cleaned",cleaned);
          const response = await updateTaskFirebase(singleTask.id, cleaned);

          if (response.success) {
            setLoading(false)
            toast.success(`Task ${singleTask.serialNo} Updated Successfully`);
            onClose();
            reset();
            onTaskAdded?.();            
          } else {
              toast.error("Error Updating Task");
              throw response.error;
          }          
        } else {
          const createPayload = {
            ...cleaned,
            createdBy: user.id,
            createdByName: user.name,
            keywords: generateKeywords(cleaned.title, cleaned.client, selectedCoders)        
          };
          console.log("createPayload",createPayload);
          try {
            const response=await addTaskFirebase(createPayload);
            if(response.success){
              setLoading(false);
              toast.success(`Task ${response.serialNo} Created Successfully`);
              onClose();
              reset();
              onTaskAdded?.();
            }else{
              toast.error("Error Creating Task");
              throw response.error;
            }
          } catch (error) {
              console.error("Add Task Error:", error);
              toast.error("Failed to add task. Please try again.");
          }          
        }        
    };

    return (
      <div ref={backdropRef} className='fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-end cursor-pointer' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <div className='bg-white w-96 h-full flex flex-col p-4 cursor-auto' onMouseDown={(e) => e.stopPropagation()} onMouseUp={(e) => e.stopPropagation()} >
          <div className='flex justify-end mb-2'>
            <button onClick={onClose}><IoMdCloseCircle className='text-2xl'/></button>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">{editingMode?"Edit Task" : "Add Task"}</h2>

          {loading?(
            <>
              <div>
                <Loader color='text-blue' height='h-64'/>
              </div>
            </>
          ):(
            <>
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit(onSubmit)} className='container mx-auto pt-5 pb-4 relative'> 
                {/* Client Input Start */}
                  <div className="w-full">
                    <Select 
                      label="Client Name"
                      defaultOption= "Select Client"
                      className="py-1 text-sm"
                      labelClass='font-semibold mt-2'
                      options={clientOptions}
                      // defaultValue={watch("client") || ""}
                      value={watch("client") || ""}
                      {...register("client",{
                        required: "Please select Client",
                      })}
                      error={errors.client && errors.client.message}
                    /> 
                  </div>
                {/* Client Input End */}  

                {/* Title Input Start */}
                  <div className="w-full">
                    <Input 
                        label="Task Title"
                        placeholder="Enter Task Title"
                        type="text"
                        className="py-1 text-sm"
                        labelClass='font-semibold  mt-2'
                        {...register("title", {
                            required: "Title is Required",
                            pattern: {
                                value: /^[a-zA-Z0-9 _.-]{1,100}$/,
                                message: "Title can only contain letters, numbers, spaces, -, _, and ."
                            }
                        })}
                        error={errors.title && errors.title.message}
                    />  
                  </div>
                {/* Title Input End */}

                {/* Description Input Start */}
                  <div className="w-full">
                    <Input 
                        label="Task Description"
                        placeholder="Enter Task Description"
                        isTextarea = {true}
                        className="py-1 text-sm"
                        labelClass='font-semibold mt-2'
                        {...register("description", {
                            required: "Description is Required",
                            pattern: {
                                value: /^[^{}\[\];]{1,1000}$/,
                                message: "Description can only contain letters, numbers, spaces, -, _, and ."
                            }
                        })}
                        error={errors.description && errors.description.message}
                    />  
                  </div>
                {/* Description Input End */}  

                {/* Priority Input Start */}
                  <div className="w-full">
                    <Select 
                    className="py-1 text-sm"
                    label="Task Priority"
                    defaultOption= "Select Priority"
                    labelClass='font-semibold mt-2'
                    options={taskPrioritiesOptions}
                      {...register("priority",{
                        required: "Please Select Priority",
                      })}
                      error={errors.priority && errors.priority.message}
                    /> 
                  </div>
                {/* Priority Input End */}  

                {/* Task Phase Input Start */}
                  <div className="w-full">
                    <Select 
                      label="Task Phase"
                      defaultOption= "Select Phase"
                      className="py-1 text-sm"
                      labelClass='font-semibold mt-2'
                      options={taskPhasesOptions}
                      {...register("taskPhase",{
                        required: "Please select Phase",
                      })}
                      error={errors.taskPhase && errors.taskPhase.message}
                    /> 
                  </div>
                {/* Task Phase Input End */}  

                {/* Task Status Input Start */}
                  <div className="w-full">
                    <Select 
                    className="py-1 text-sm"
                    label="Task Status"
                    defaultOption= "Select Status"
                    labelClass='font-semibold mt-2'
                    options={statusesOptions}
                      {...register("taskStatus",{
                        required: "Please Select Status",
                      })}
                      error={errors.taskStatus && errors.taskStatus.message}
                    /> 
                  </div>
                {/* Task Status Input End */}  

                {/* Date Input Start */}
                <div className='flex gap-2'>
                    <div className="w-full">
                      <DatePicker
                        label="Task Start Date"
                        labelClass='font-semibold mt-2'
                        className="py-1 text-sm"
                        {...register("startDate",{
                          required:"Please Select Start Date"
                        })}
                        error={errors.startDate && errors.startDate.message}
                      />
                    </div>

                    <div className="w-full">
                      <DatePicker
                        label="Task End Date"
                        labelClass='font-semibold mt-2'
                        className="py-1 text-sm"
                        disabled={!startDateValue}
                        placeholder={!startDateValue ? "Please select Start Date first" : ""}
                        min={startDateValue}
                        {...register("endDate",{
                          required:"Please Select End Date",
                          validate: value => {
                            if (!startDateValue) return true; // skip check if start not selected yet
                            if (new Date(value) < new Date(startDateValue)) {
                              return "End Date cannot be before Start Date";
                            }
                            return true;
                          }                      
                        })} 
                        error={errors.endDate && errors.endDate.message}                   
                      />
                    </div>
                </div>
                {/* Date Input End */}  

                {/* assignedCoderNames Input Start */}
                {user.userRole !== "Coder" && (
                  <div className="w-full">
                      <MultiSelect_Tag 
                        label="Coders"
                        className='p-1 text-sm'
                        labelClass='font-semibold mt-2'
                        options={codersOptions}   
                        defaultValue={watch("coders") || []}
                        // options={["React", "JavaScript", "HTML", "CSS"]}  
                        {...register("coders",{
                          required:"Please Select Coders"
                        })} 
                        error={errors.coders && errors.coders.message}                                      
                      />
                  </div>
                )}
                {/* assignedCoderNames Input End */}   

                <div className='flex items-center justify-center gap-2 mt-3'>
                    <Button type="submit" variant='primary' className='py-2 text-sm' isLoading={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : editingMode ? 'Update Task' : 'Create Task'}
                    </Button>
                    <Button type="reset" variant='danger' className='py-2 text-sm' onClick={()=>reset()}>Reset</Button>
                </div>
              </form>   
            </div>         
            </>
          )}
        </div>
      </div>
    )
}

export default AddTask
