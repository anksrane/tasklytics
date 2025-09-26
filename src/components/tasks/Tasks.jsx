import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { ButtonWithIcon, AddTask, ViewTask, ConfirmTrashModal, InputSearch, Loader } from '../index.js'
import { IoMdAdd } from "react-icons/io";
import { MdOutlineClear } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { IoEyeSharp } from "react-icons/io5";
import { GoTrash } from "react-icons/go";
import { useSelector } from 'react-redux';
import { Timestamp } from "firebase/firestore";

import { fetchAllDropdowns } from '../../firebase/dropdownService.js';
import { getAllTaskFirebase } from '../../firebase/taskServices/getAllTasksWithFilter.js';
import { deleteAllTasksService } from '../../firebase/taskServices/deleteAllTasksService.js'

import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';

const formatDate = (val) => {
  if (!val) return "-";
  let dateObj;
  if (val instanceof Timestamp) {
    dateObj = val.toDate();
  } else if (val?.seconds) {
    dateObj = new Date(val.seconds * 1000);
  } else if (val instanceof Date) {
    dateObj = val;
  } else {
    return String(val);
  }  
  // Format as DD-MM-YYYY
  const day = String(dateObj.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[dateObj.getMonth()]; // Months are 0-based
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`;
};

function Tasks() {
    const {user}=useSelector((state)=>state.auth);

    const [tasksData, setTasksData] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [loadingDropdowns, setLoadingDropdowns] = useState(true);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [singleTask, setSingleTask] = useState({});
    const [editingMode,setEditingMode]= useState(false);
    const [showDeleteModal,setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState({});
    const [showViewModal,setShowViewModal] = useState(false);
    const [viewData, setViewData] = useState({});

    const [sorting,setSorting]=useState([]);
    const [globalFilter,setGlobalFilter]=useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5); 
    const [searchText,setSearchText]=useState('');
    const [appliedSearchText, setAppliedSearchText] = useState('');
    const [hasMorePages, setHasMorePages] = useState(false);
    const [filters, setFilters] = useState({ phase: '', status: '', priority: '', trash: false });

    const [dropdowns, setDropdowns] = useState({ taskPhases: [], taskPriorities: [], statuses: [], clients: [] });

    // Fetch all dropdown options
    useEffect(() => {
        const getDropdownData = async () => {
          setLoadingDropdowns(true);
            try {
                const data = await fetchAllDropdowns();
                setDropdowns(data);
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
                setDropdowns({ taskPhases: [], taskPriorities: [], statuses: [],clients:[] });
            } finally {
              setLoadingDropdowns(false);
            }
        };
        getDropdownData();
    }, []);    

    // Fetch all task with data
    const fetchTasksWith = useCallback(async (customFilters = filters, targetPage = currentPage) => {
      setLoadingTasks(true);
      setTasksData([]);

      const sortBy = sorting[0]?.id || 'created_at';
      const sortOrder = sorting[0]?.desc ? 'desc' : 'asc';   

      const response = await getAllTaskFirebase(
        user,
        appliedSearchText,
        customFilters,
        sortBy,
        sortOrder,
        pageSize,
        targetPage,
        dropdowns.taskPhases, 
        dropdowns.taskPriorities,
        dropdowns.statuses,
        dropdowns.clients
      );

      if (response.success) {
        setTasksData(response.data);
        setHasMorePages(response.hasMore);  
        setTotalTasks(response.total);
        setCurrentPage(response.currentPage);
      } else {
        console.error("Failed to fetch tasks:", response.error);
        setTasksData([]); 
        setHasMorePages(false);
      }

      setLoadingTasks(false);
    },[user,filters, sorting, appliedSearchText, pageSize, currentPage, dropdowns]);


    useEffect(() => {
      // Only fetch tasks if dropdowns are loaded (or if they are empty, which is a valid state)
      if (!loadingDropdowns) {
          fetchTasksWith(filters);
      }
    }, [appliedSearchText, sorting, filters, currentPage, fetchTasksWith, loadingDropdowns]);

    const columnHelper=createColumnHelper();
    const columns = [
        columnHelper.accessor('',{
            header: 'Sr No',
            cell: info => (currentPage - 1) * pageSize + info.row.index + 1,
            enableSorting: true,
            enableGlobalFilter: true
        }),      
        columnHelper.accessor('serialNo',{
            header: 'Task No',
            cell: info => info.getValue(),
            enableSorting: true,
            enableGlobalFilter: true
        }),      
        columnHelper.accessor('clientLabel',{
            header: 'client',
            cell: info => info.getValue(),
            enableSorting: true,
            enableGlobalFilter: true
        }),      
        columnHelper.accessor('title',{
            header: 'Title',
            cell: info => info.getValue(),
            enableSorting: false,
            enableGlobalFilter: true
        }),
        columnHelper.accessor('taskStatusLabel',{
            header: 'Status',
            cell: info => info.getValue(),
            enableSorting: true,
            enableGlobalFilter: true
        }),
        columnHelper.accessor('taskPhaseLabel',{
            header: 'Phase',
            cell: info => info.getValue(),
            enableSorting: true,
            enableGlobalFilter: true
        }),
        columnHelper.accessor('priorityLabel',{
            header: 'Priority',
            cell: info => {
              // Example of custom cell rendering with Tailwind for status colors
              const priority = info.getValue();
              let priorityClass = '';
              switch (priority) {
                  case 'Medium':
                    priorityClass = 'bg-orange-200 text-orange-800';
                  break;

                  case 'Low':
                    priorityClass = 'bg-green-200 text-green-800';
                  break;

                  case 'High':
                    priorityClass = 'bg-red-200 text-red-800';
                  break;
              }
                  return (
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${priorityClass}`}>
                      {priority}
                      </span>
                  );
            },
            enableSorting: true,
            enableGlobalFilter: true
        }),
        columnHelper.accessor('startDate',{
            header: 'Start Date',
            cell: info => formatDate(info.getValue()),
            enableSorting: true,
            enableGlobalFilter: true
        }),
        columnHelper.accessor('endDate',{
            header: 'Due Date',
            cell: info => formatDate(info.getValue()),
            enableSorting: true,
            enableGlobalFilter: true
        }),
        // You can add more columns here, e.g., for actions like 'Edit', 'Delete'
        columnHelper.display({
            id: 'actions', // Unique ID for this display column
            header: 'Actions',
            cell: props => (
            <div className="flex gap-3">
                <button
                className="border border-background font-bold p-1 hover:delay-100 text-backgorund hover:bg-background hover:text-text-light rounded-md text-xs"
                  onClick={() => {
                      setSingleTask(props.row.original); // Set task for editing
                      setEditingMode(true);
                      setShowAddTaskModal(true);
                  }}
                >
                <TbEdit className='text-xl font-bold'/>
                </button>

                <button
                className="border border-background font-bold p-1 hover:delay-100 text-backgorund hover:bg-background hover:text-text-light rounded-md text-xs"
                  onClick={() => {
                    setViewData(props.row.original);
                    setShowViewModal(true);
                  }}
                >
                <IoEyeSharp className='text-xl font-bold'/>
                </button>

                <button
                className="border border-danger font-bold p-1 hover:delay-100 text-danger hover:bg-danger hover:text-text-light rounded-md text-xs"
                  onClick={() => {
                    setDeleteData(props.row.original);
                    setShowDeleteModal(true);
                  }}
                >
                <GoTrash className='text-lg font-bold'/>
                </button>
            </div>
            ),
            enableSorting: false,
            enableGlobalFilter: false,
        }),    
    ];

    const table = useReactTable({
        data: tasksData,
        columns: columns,
        state: {
            sorting,
            globalFilter,
            pagination: {
                pageIndex: currentPage-1,
                pageSize: pageSize
            }
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        manualPagination: true,
        pageCount: Math.ceil(totalTasks / pageSize),
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(), 
    });

    const pageCount = table.getPageCount(); 
      
    const pageNumbers = useMemo(() => {
        const numbers = [];
        const maxVisiblePages = 3; 

        if (pageCount === 0) {
            return [];
        }

        // Calculate half window
        const half = Math.floor(maxVisiblePages / 2);

        let startPage = currentPage - half;
        let endPage = currentPage + half;

        // Clamp start and end
        if (startPage < 1) {
            startPage = 1;
            endPage = Math.min(maxVisiblePages, pageCount);
        } else if (endPage > pageCount) {
            endPage = pageCount;
            startPage = Math.max(1, pageCount - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            numbers.push(i);
        }
        console.log(numbers);
        return numbers;
    }, [currentPage, pageCount]);  

    const addIcon=<IoMdAdd />;  

    const handleDeleteAll = async () => {
        if (!window.confirm("Are you sure you want to delete all tasks and reset the counter?")) {
            return;
        }
        try {
            await deleteAllTasksService();
            setCurrentPage(1);
            fetchTasksWith(filters, 1);
            alert("All tasks deleted and serial number reset!");
        } catch (error) {
            alert("Error deleting tasks. Check console for details.",error);
        }
    };

    return (
    <>

    {showAddTaskModal && (

      <AddTask 
        onClose={() => setShowAddTaskModal(false)} 
        show={showAddTaskModal} 
        singleTask= {singleTask}
        editingMode={editingMode}
        onTaskAdded={() => fetchTasksWith(filters, currentPage)} 
        taskPhasesOptions={dropdowns.taskPhases} // Pass as prop
        taskPrioritiesOptions={dropdowns.taskPriorities} // Pass as prop
        statusesOptions={dropdowns.statuses} // Pass as prop
        clientOptions={dropdowns.clients}
      />
    )}

    {showViewModal && (
      <ViewTask
        onClose={()=> setShowViewModal(false)}
        show={showViewModal}
        viewData={viewData}
      />
    )}
    
    {showDeleteModal && (
      <ConfirmTrashModal
       onClose={()=>setShowDeleteModal(false)}
       deleteData={deleteData}
       onTaskAdded={() => fetchTasksWith(filters, currentPage)}
       />
    )}

    <div className="mx-auto p-4 z-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-text-secondary">Task List</h2>
      
      <div>
          {/* Add Task Button */}
          <ButtonWithIcon icon={addIcon} iconClass={'text-lg font-800'} iconPosition="left" variant="primary" className='text-sm mt-0 mb-2 font-semibold' 
            onClick={()=>{
              setShowAddTaskModal(true);
              setEditingMode(false);
              setSingleTask(null);
            }}>
            Add Task
          </ButtonWithIcon>        
        {/* Global Search Input */}
        <div className="mb-4 flex sm:flex-row flex-col gap-1 justify-between">

          <div className="flex sm:flex-row flex-col gap-1">
            {['phase','status','priority'].map(filterKey => (
              <div key={filterKey} className='flex border-border rounded-md'>
                <select
                  className="px-2 py-1 text-sm w-full rounded-tl-md rounded-bl-md focus:border-primary"
                  value={filters[filterKey]}
                  onChange={(e) => setFilters(prev => ({ ...prev, [filterKey]: e.target.value }))}
                >
                  <option value="">All {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}</option>
                  {(dropdowns[filterKey === 'phase' ? 'taskPhases' : filterKey === 'status' ? 'statuses' : 'taskPriorities'] || []).map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button className='bg-danger hover:bg-danger p-1 rounded-tr-md rounded-br-md text-white'
                  onClick={() => setFilters(prev => ({ ...prev, [filterKey]: '' }))}><MdOutlineClear/></button>
              </div>
            ))}
          </div>

          {/* Input Search New*/}
            <InputSearch 
              type="text" 
              placeholder="Search Task No, Client Name, Title" 
              value={searchText}
              className="px-1 py-1 text-sm"
              clearBtnClassName="px-1 py-1 text-sm text-transpart"
              searchBtnClassName="px-1 py-1 text-sm"
              onChange={e => setSearchText(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setAppliedSearchText(searchText); // Apply the current input
                  setCurrentPage(1);
                }
              }}
              onClear={() => { setSearchText(''); setAppliedSearchText(''); setCurrentPage(1); }}
              showClear={true}
            />
        </div>

        {loadingTasks || loadingDropdowns ?(
          <div className="flex justify-center items-center h-40">
            <Loader className='text-primary' />
          </div>
        ) :
        (
        <div>
          <div className="overflow-x-auto rounded-md shadow-md">
            <table className="min-w-full border rounded-md shadow-sm text-text">
              {/* Table Header (<thead>) */}
              <thead className="bg-primary text-text">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider select-none ${header.column.getCanSort()? 'cursor-pointer' : ''}`}
                        // Add onClick handler for sorting if the column is sortable
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {/* Sort indicator */}
                          {header.column.getCanSort() && (
                            <span>
                              {{
                                asc: ' 🔼', 
                                desc: ' 🔽', 
                              }[header.column.getIsSorted()] ?? null}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              {/* Table Body (<tbody>) */}
              <tbody className="divide-y divide-gray-200">
                {/* Display "No results" if filtered rows are empty */}
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-4 text-center bg-table-light">
                      No tasks found.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className='border-b bg-table-light hover:bg-table'>
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="px-6 py-3 whitespace-nowrap text-sm text-left"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>  

          {/* Pagination Controls */}
          <div className="flex items-center justify-center flex-col sm:flex-row sm:justify-between flex-wrap mt-4">
            <div className="text-sm text-text-secondary mb-2 hidden sm:block">
              Showing <span className="font-semibold">{table.getFilteredRowModel().rows.length}</span> records
            </div>

            <div className="flex items-center gap-2 mb-2">
              {/* Previous Button */}
              <button
                className="px-3 py-1 border border-primary rounded-md text-sm font-medium text-primary bg-white hover:bg-primary hover:text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}            
                disabled={currentPage === 1}
              >
                &laquo;
              </button>

              {/* Page Numbers */}
              {pageNumbers.map((pageNumber, index) => (
                <React.Fragment key={index}> {/* Use index for keys for ellipses */}
                  {typeof pageNumber == 'number' ? (
                    <button
                      onClick={() => {
                        setCurrentPage(pageNumber);
                      }}
                      className={`px-3 py-1 border border-primary rounded-md text-sm ${currentPage === pageNumber ? 'bg-primary text-text font-extrabold' : 'bg-white text-primary hover:bg-primary hover:text-text-secondary font-medium' }`} >
                      {pageNumber} {/* Display 1-indexed page number */}
                    </button>
                  ) : (
                    <span className="px-3 py-1 text-gray-700">...</span>
                  )}
                </React.Fragment>
              ))}

              <button
                // onClick={() => table.nextPage()}
                onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(totalTasks / pageSize)))}
                disabled={currentPage >= Math.ceil(totalTasks / pageSize)}
                className="px-3 py-1 border border-primary rounded-md text-sm font-medium text-primary bg-white hover:bg-primary hover:text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &raquo;
              </button>
            </div>

            {/* Current Page and Total Pages Info */}
            <span className="text-sm text-text-secondary mb-2">
              Page{' '}
              <span className="font-semibold">
                {/* {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} */}
                {currentPage} of {Math.ceil(totalTasks / pageSize)}
              </span>
            </span>
          </div>              
        </div>            
        )}        
      </div>
    </div>
    </>
    )
}

export default Tasks
