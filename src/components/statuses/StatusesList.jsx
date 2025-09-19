import React,{  useState, useEffect, useCallback } from 'react'
import { IoMdAdd } from "react-icons/io";
import { InputSearch, ButtonWithIcon, Loader, AddEditStatus, DeleteStatus } from '../index.js';
import { getStatusesWithFilter } from '../../firebase/statusServices/statusesService.js';
import { TbEdit } from "react-icons/tb";
import { GoTrash } from "react-icons/go";

import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';

function StatusesList() {
  const [statusData,setStatusesData] = useState([]);
  const [loading,setLoading] = useState(true);

  const [sorting, setSorting] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(false);  
  const [searchText, setSearchText] = useState("");
  const [appliedSearchText, setAppliedSearchText] = useState('');

  const [showAddEditStatuses, setShowAddEditStatuses] = useState(false);
  const [editingStatusesData, setEditingStatusesData] = useState(null);

  const [deleteStatuses,setDeleteStatuses] = useState(null);  
  const [showDeleteStatuses, setShowDeleteStatuses] = useState(false);

  // Function to handle edit click
  const handleOpenEditPopup = (statuses) => {
    setEditingStatusesData(statuses);
    setShowAddEditStatuses(true);
  };

  const handleCloseEditPopup = () => {
    setEditingStatusesData(null);
    setShowAddEditStatuses(false);
  };  

  // Function to Handle Delete Click
  const handleOpenDeletePopup = (statuses)=> {
    setDeleteStatuses(statuses);
    setShowDeleteStatuses(true);
  }

  const handleCloseDeletePopup = () => {
    setDeleteStatuses(null);
    setShowDeleteStatuses(false);
  }

  // Define table columns
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('serialNo', {
      header: 'Sr No',
      // cell: info => info.getValue(),
      cell: info => currentPage * pageSize + info.row.index + 1,
      enableSorting: false,
    }),
    columnHelper.accessor('label', {
      header: 'Statuses Name',
      cell: info => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor('color', {
      header: 'Color',
      cell: info => {
        const color = info.getValue();
        return (
          <div className="flex items-center gap-2">
            {/* Color preview box */}
            <span
              className="w-10 h-5 rounded-md border border-background"
              style={{ backgroundColor: color }}
            ></span>
          </div>
        );
      },
      enableSorting: true,
    }),
    columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: props => (
        <div className="flex gap-3 justify-center">
            <button
            className="border border-background font-bold p-1 hover:delay-100 text-backgorund hover:bg-background hover:text-text-light rounded-md text-xs"
            onClick={() => handleOpenEditPopup(props.row.original)}
            >
            <TbEdit className='text-xl font-bold'/>
            </button>

            <button
            className="border border-danger font-bold p-1 hover:delay-100 text-danger hover:bg-danger hover:text-text-light rounded-md text-xs"
              onClick={()=> handleOpenDeletePopup(props.row.original)}
            >
            <GoTrash className='text-lg font-bold'/>
            </button>
        </div>
        ),
        enableSorting: false,
        enableGlobalFilter: false,
    }),      
  ];

  // Fetch statuses data
  const fetchStatuses = useCallback(async (targetPage = 0) => {
    setLoading(true);

    const response = await getStatusesWithFilter({
      page: targetPage + 1,
      pageSize,
      search: appliedSearchText, 
    });

    if (response) {
      setStatusesData(response.data);
      setHasMorePages(response.total > (targetPage + 1) * pageSize);
      setTotalPages(response.totalPages);
    } else {
      setStatusesData([]);
      setHasMorePages(false);
    }

    setLoading(false);
  }, [pageSize, appliedSearchText]);

  useEffect(() => {
    fetchStatuses(currentPage); // fetch first page on mount
  }, [currentPage, appliedSearchText]);  

  // TanStack Table instance
  const table = useReactTable({
    data: statusData,
    columns: columns,
    state: {
      sorting,
      pagination: { pageIndex: currentPage, pageSize },
    },
    manualPagination: true,
    pageCount: hasMorePages ? currentPage + 2 : currentPage + 1,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });  

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);      // update state
    fetchStatuses(pageNumber);        // fetch new data
  };  

  const addIcon=<IoMdAdd />; 

  return (
    <div className="mx-auto p-4 z-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-text-secondary">Statuses List</h2>

      <div className='mb-4 flex xs:flex-row flex-col gap-1 justify-between'>
        {/* Add statuses */}
        <ButtonWithIcon icon={addIcon} iconClass={'text-lg font-800'} iconPosition="left" variant="primary" className='text-sm mt-0 mb-2 font-semibold px-4 py-1'
          onClick={() => setShowAddEditStatuses(true)}>
          Add Statuses
        </ButtonWithIcon>         

        {/* Search statuses */}
        <InputSearch
          placeholder="Search status..."
          value={searchText}
          className="px-1 py-1 text-sm"
          clearBtnClassName="px-1 py-1 text-sm text-transpart"
          searchBtnClassName="px-1 py-1 text-sm"               
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setAppliedSearchText(searchText); // ✅ apply on Enter
              setCurrentPage(0); // reset page
            }
          }}
          onSearch={(value) => {
            setSearchText(value);
          }}  
          onClear={() => {
            setSearchText('');
            setAppliedSearchText('');
            setCurrentPage(0);
          }}
          showClear={true}              
        />   
      </div>   

      {loading ?
      (
        <div className="flex justify-center items-center h-40">
          <Loader className='text-primary' />
        </div>          
      ):(      
        <div>    
          <div className="overflow-x-auto rounded-md">
            <table className="min-w-full border rounded-md shadow-sm text-text">
              <thead className="bg-primary text-text">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider select-none 
                          ${header.id === "serialNo" ? "w-[10%]" : ""} 
                          ${header.id === "label" ? "w-[75%]" : ""} 
                          ${header.id === "actions" ? "w-[15%]" : ""} 
                          ${header.column.getCanSort() ? "cursor-pointer" : ""}`}
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <div className={`flex items-center gap-1 ${header.id === "actions" ? "justify-center" : ""}`}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
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
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-4 text-center bg-table-light">
                      No phases found.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className='border-b bg-table-light hover:bg-table'>
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="px-6 py-3 whitespace-nowrap text-sm text-left text-text-dark"
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

          <div className="flex items-center justify-center flex-col sm:flex-row sm:justify-between flex-wrap mt-4">
              <div className="text-sm text-text-secondary mb-2 hidden sm:block">
                Showing <span className="font-semibold">{table.getFilteredRowModel().rows.length}</span> records
              </div>

              <div className="flex items-center gap-2 mb-2">
                <button className='px-3 py-1 border border-primary rounded-md text-sm font-medium text-primary bg-white hover:bg-primary hover:text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed' onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}>
                  &laquo; 
                </button>

                {Array.from({ length: totalPages }, (_, i) => i).map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => {
                      setCurrentPage(pageNumber);
                      fetchPhases(pageNumber);
                    }}
                    className={`px-3 py-1 border border-primary rounded-md text-sm ${currentPage === pageNumber ? 'bg-primary text-text font-extrabold' : 'bg-white text-primary hover:bg-primary hover:text-text-secondary font-medium'}`}
                  >
                    {pageNumber + 1}
                  </button>
                ))}

                <button
                  className="px-3 py-1 border border-primary rounded-md text-sm font-medium text-primary bg-white hover:bg-primary hover:text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages - 1}>
                  &raquo;
                </button>
              </div>

              {/* Current Page and Total Pages Info */}
              <span className="text-sm text-text-secondary mb-2">
                Page{' '}
                <span className="font-semibold">
                  {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
              </span>        
          </div>
        </div>
      )
      }

      {showAddEditStatuses && (
        <AddEditStatus
          onClose={handleCloseEditPopup}
          editingMode={!!editingStatusesData}
          statusData={editingStatusesData}
          onStatusAdded={() => {
            fetchStatuses(currentPage);
          }}
        />
      )}   

      {
        showDeleteStatuses && (
          <DeleteStatus 
            onClose={handleCloseDeletePopup}
            statusData={deleteStatuses}
            onStatusDeleted={() => {
              fetchStatuses(currentPage);
            }}
          />
        )
      }

    </div>
    
  );
}

export default StatusesList
