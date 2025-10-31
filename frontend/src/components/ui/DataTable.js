'use client';

import { useState, useEffect, useMemo } from 'react';
import { FiChevronDown, FiChevronUp, FiChevronRight, FiSearch, FiDownload, FiFilter, FiRefreshCw } from 'react-icons/fi';

const DataTable = ({
  data = [],
  columns = [],
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  searchable = true,
  sortable = true,
  filterable = false,
  selectable = false,
  exportable = false,
  loading = false,
  onRowClick,
  emptyMessage = 'Aucune donnée disponible',
  loadingMessage = 'Chargement des données...',
  className = '',
  onSelectionChange,
  refreshable = false,
  onRefresh
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data, searchQuery, filters]);
  
  // Handle selection change
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedRows);
    }
  }, [selectedRows, onSelectionChange]);
  
  // Apply search filter
  const searchedData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    
    return data.filter(item => {
      return columns.some(column => {
        if (!column.searchable) return false;
        
        const value = column.accessor ? 
          (typeof column.accessor === 'function' ? column.accessor(item) : item[column.accessor]) : 
          '';
          
        if (value === null || value === undefined) return false;
        
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [data, searchQuery, columns]);
  
  // Apply column filters
  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return searchedData;
    
    return searchedData.filter(item => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        
        const column = columns.find(col => col.accessor === key);
        if (!column) return true;
        
        const value = typeof column.accessor === 'function' ? 
          column.accessor(item) : 
          item[column.accessor];
          
        if (value === null || value === undefined) return false;
        
        if (column.filterType === 'select') {
          return String(value) === String(filterValue);
        }
        
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
      });
    });
  }, [searchedData, filters, columns]);
  
  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const column = columns.find(col => col.accessor === sortConfig.key);
      if (!column) return 0;
      
      const aValue = typeof column.accessor === 'function' ? 
        column.accessor(a) : 
        a[column.accessor];
        
      const bValue = typeof column.accessor === 'function' ? 
        column.accessor(b) : 
        b[column.accessor];
      
      if (aValue === null || aValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'asc' 
        ? (aValue > bValue ? 1 : -1) 
        : (aValue < bValue ? 1 : -1);
    });
  }, [filteredData, sortConfig, columns]);
  
  // Apply pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * currentPageSize;
    return sortedData.slice(startIndex, startIndex + currentPageSize);
  }, [sortedData, currentPage, currentPageSize, pagination]);
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    if (!pagination) return 1;
    return Math.ceil(sortedData.length / currentPageSize);
  }, [sortedData, currentPageSize, pagination]);
  
  // Handle sort
  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };
  
  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle row selection
  const handleRowSelect = (id) => {
    if (!selectable) return;
    
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (!selectable) return;
    
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(row => row.id));
    }
    
    setSelectAll(!selectAll);
  };
  
  // Export to CSV
  const exportToCSV = () => {
    if (!exportable) return;
    
    const headers = columns
      .filter(col => col.exportable !== false)
      .map(col => col.header);
      
    const rows = sortedData.map(row => {
      return columns
        .filter(col => col.exportable !== false)
        .map(col => {
          const value = typeof col.accessor === 'function' 
            ? col.accessor(row) 
            : row[col.accessor];
            
          return value !== null && value !== undefined ? String(value) : '';
        });
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Render pagination controls
  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;
    
    const pageNumbers = [];
    const maxPageButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Affichage de {Math.min((currentPage - 1) * currentPageSize + 1, sortedData.length)} à {Math.min(currentPage * currentPageSize, sortedData.length)} sur {sortedData.length} entrées
          </span>
          
          <select
            value={currentPageSize}
            onChange={(e) => {
              setCurrentPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            «
          </button>
          
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            ‹
          </button>
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            ›
          </button>
          
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            »
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`w-full ${className}`}>
      {/* Table Controls */}
      {(searchable || exportable || refreshable) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          {/* Search */}
          {searchable && (
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Refresh Button */}
            {refreshable && onRefresh && (
              <button
                onClick={onRefresh}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            
            {/* Export Button */}
            {exportable && (
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading || sortedData.length === 0}
              >
                <FiDownload />
                <span>Exporter</span>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Select All Checkbox */}
              {selectable && (
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </th>
              )}
              
              {/* Column Headers */}
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    sortable && column.sortable !== false ? 'cursor-pointer select-none' : ''
                  } ${column.className || ''}`}
                  onClick={() => column.sortable !== false && handleSort(column.accessor)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    
                    {sortable && column.sortable !== false && (
                      <div className="flex flex-col">
                        <FiChevronUp 
                          className={`w-3 h-3 ${
                            sortConfig.key === column.accessor && sortConfig.direction === 'asc'
                              ? 'text-primary'
                              : 'text-gray-400'
                          }`} 
                        />
                        <FiChevronDown 
                          className={`w-3 h-3 -mt-1 ${
                            sortConfig.key === column.accessor && sortConfig.direction === 'desc'
                              ? 'text-primary'
                              : 'text-gray-400'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Column Filter */}
                  {filterable && column.filterable !== false && (
                    <div className="mt-2">
                      {column.filterType === 'select' && column.filterOptions ? (
                        <select
                          value={filters[column.accessor] || ''}
                          onChange={(e) => handleFilterChange(column.accessor, e.target.value)}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="">Tous</option>
                          {column.filterOptions.map((option, i) => (
                            <option key={i} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder="Filtrer"
                          value={filters[column.accessor] || ''}
                          onChange={(e) => handleFilterChange(column.accessor, e.target.value)}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                        />
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="px-4 py-4 text-center text-gray-500"
                >
                  {loadingMessage}
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="px-4 py-4 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex}
                  className={`${
                    onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
                  } ${selectedRows.includes(row.id) ? 'bg-blue-50' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {/* Row Select Checkbox */}
                  {selectable && (
                    <td className="px-4 py-3 w-10" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                    </td>
                  )}
                  
                  {/* Row Cells */}
                  {columns.map((column, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className={`px-4 py-3 ${column.cellClassName || ''}`}
                    >
                      {column.cell ? (
                        column.cell(row)
                      ) : (
                        <div className="text-sm text-gray-900">
                          {typeof column.accessor === 'function' 
                            ? column.accessor(row) 
                            : row[column.accessor]}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default DataTable;