import React,{  useState, useEffect, useCallback } from 'react'
import { IoMdAdd } from "react-icons/io";
import { InputSearch, ButtonWithIcon, Loader, AddEditClient, DeleteClient } from '../index.js';
import { getClientsWithFilter } from '../../firebase/clientServices/clientsService';
import { TbEdit } from "react-icons/tb";
import { GoTrash } from "react-icons/go";

import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';

function ClientsList() {
  const [clientsData,setClientsData] = useState([]);
  const [loadingClients,setLoadingClients] = useState(true);

  const [sorting, setSorting] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(false);  
  const [searchText, setSearchText] = useState("");
  const [appliedSearchText, setAppliedSearchText] = useState('');

  const [showAddEditClient, setShowAddEditClient] = useState(false);
  const [editingClientData, setEditingClientData] = useState(null);

  const [deleteClient,setDeleteClient] = useState(null);  
  const [showDeleteClient, setShowDeleteClient] = useState(false);

  // Function to handle edit click
  const handleOpenEditPopup = (client) => {
    setEditingClientData(client);
    setShowAddEditClient(true);
  };

  const handleCloseEditPopup = () => {
    setEditingClientData(null);
    setShowAddEditClient(false);
  };  

  // Function to Handle Delete Click
  const handleOpenDeletePopup = (client)=> {
    setDeleteClient(client);
    setShowDeleteClient(true);
  }

  const handleCloseDeletePopup = () => {
    setDeleteClient(null);
    setShowDeleteClient(false);
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
      header: 'Client Name',
      cell: info => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: props => (
        <div className="flex gap-3 justify-center">
            <button
            className="border border-slate-500 font-bold p-1 hover:delay-100 hover:bg-black hover:text-white rounded text-xs"
            onClick={() => handleOpenEditPopup(props.row.original)}
            >
            <TbEdit className='text-xl font-bold'/>
            </button>

            <button
            className="border border-red-500 font-bold p-1 hover:delay-100 hover:bg-red-500 text-red-500 hover:text-white rounded text-xs"
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

  // Fetch clients data
  const fetchClients = useCallback(async (targetPage = 0) => {
    setLoadingClients(true);

    const response = await getClientsWithFilter({
      page: targetPage + 1,
      pageSize,
      search: appliedSearchText, 
    });

    if (response) {
      setClientsData(response.data);
      setHasMorePages(response.total > (targetPage + 1) * pageSize);
      setTotalPages(response.totalPages);
    } else {
      setClientsData([]);
      setHasMorePages(false);
    }

    setLoadingClients(false);
  }, [pageSize, appliedSearchText]);

  useEffect(() => {
    fetchClients(currentPage); // fetch first page on mount
  }, [currentPage, appliedSearchText]);  

  // TanStack Table instance
  const table = useReactTable({
    data: clientsData,
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
    fetchClients(pageNumber);        // fetch new data
  };  

  const addIcon=<IoMdAdd />; 

  return (
    <div className="mx-auto p-4 z-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Clients List</h2>

      <div className='mb-4 flex xs:flex-row flex-col gap-1 justify-between'>
        {/* Add Clients */}
        <ButtonWithIcon icon={addIcon} iconClass={'text-xl font-bold'} iconPosition="left" variant="primary" className='text-sm mt-0' 
          onClick={() => setShowAddEditClient(true)}>
          Add Client
        </ButtonWithIcon>         

        {/* Search Clients */}
        <InputSearch
          placeholder="Search clients..."
          value={searchText}
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

      {loadingClients ?
      (
        <div className="flex justify-center items-center h-40">
          <Loader color='text-blue' />
        </div>          
      ):(      
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none 
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
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                    No clients found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 text-left"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>      

          <div className="flex items-center justify-center flex-col sm:flex-row sm:justify-between flex-wrap mt-4">
              <div className="text-sm text-gray-700 mb-2 hidden sm:block">
                Showing <span className="font-semibold">{table.getFilteredRowModel().rows.length}</span> records
              </div>

              <div className="flex items-center gap-2 mb-2">
                <button className='px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed' onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}>
                  &laquo; 
                </button>

                {Array.from({ length: totalPages }, (_, i) => i).map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => {
                      setCurrentPage(pageNumber);
                      fetchClients(pageNumber);
                    }}
                    className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${currentPage === pageNumber ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    {pageNumber + 1}
                  </button>
                ))}

                <button
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages - 1}>
                  &raquo;
                </button>
              </div>

              {/* Current Page and Total Pages Info */}
              <span className="text-sm text-gray-700 mb-2">
                Page{' '}
                <span className="font-semibold">
                  {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
              </span>        
          </div>
        </div>
      )
      }

      {showAddEditClient && (
        <AddEditClient
          onClose={handleCloseEditPopup}
          editingMode={!!editingClientData}
          clientData={editingClientData}
          onClientAdded={() => {
            fetchClients(currentPage);
          }}
        />
      )}   

      {
        showDeleteClient && (
          <DeleteClient 
            onClose={handleCloseDeletePopup}
            clientData={deleteClient}
            onClientDeleted={() => {
              fetchClients(currentPage);
            }}
          />
        )
      }

    </div>
    
  );
}

export default ClientsList
