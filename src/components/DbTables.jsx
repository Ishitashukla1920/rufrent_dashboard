import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

const TableDropdown = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  const tableBodyRef = useRef(null);
  const headerRef = useRef(null);

  // Fetch available tables on mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin-st-tables"
        );
        setTables(response.data.tables || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  // Handle scrolling to detect if the table header should be sticky
  useEffect(() => {
    const handleScroll = () => {
      if (tableBodyRef.current && headerRef.current) {
        const { top } = tableBodyRef.current.getBoundingClientRect();
        setIsHeaderSticky(top < 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch table data when a table is selected
  const handleTableChange = async (event) => {
    const selected = event.target.value;
    setSelectedTable(selected);
    if (selected) {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getRecords?tableName=${selected}&fieldNames=*`
        );
        if (response.data.result.length > 0) {
          setTableHeaders(Object.keys(response.data.result[0]));
          setTableData(response.data.result);
        } else {
          setTableHeaders([]);
          setTableData([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setTableHeaders([]);
      setTableData([]);
    }
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (rowIndex) => {
    const updatedSelectedRows = new Set(selectedRows);
    if (updatedSelectedRows.has(rowIndex)) {
      updatedSelectedRows.delete(rowIndex);
    } else {
      updatedSelectedRows.add(rowIndex);
    }
    setSelectedRows(updatedSelectedRows);
  };

  // Handle cell changes
  const handleCellChange = (event, rowIndex, header) => {
    const value = event.target.value;
    setTableData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex] = { ...newData[rowIndex], [header]: value };
      return newData;
    });
  };

  // Save changes (handles both POST and PUT)
  const handleSave = async () => {
    try {
      for (const rowIndex of selectedRows) {
        const row = tableData[rowIndex];

        if (row.id && Number.isInteger(row.id)) {
          // PUT request for rows with valid IDs
          await axios.put("http://localhost:5000/api/updateRecord", {
            tableName: selectedTable,
            fieldValuePairs: row,
            whereCondition: `id=${row.id}`,
          });
        } else {
          // POST request for rows with missing or invalid IDs
          const maxId = Math.max(...tableData.map((r) => (r.id ? r.id : 0)));
          row.id = maxId + 1;
          await axios.post("http://localhost:5000/api/addNewRecord", {
            tableName: selectedTable,
            fieldNames: Object.keys(row).join(","),
            fieldValues: Object.values(row).join(","),
          });
        }
      }

      alert("Save operation successful!");
      setSelectedRows(new Set());
    } catch (err) {
      console.error("Save operation failed:", err.message);
      alert("Failed to save changes. Please try again.");
    }
  };

  // Delete selected rows
  const handleDeleteRows = async () => {
    if (selectedRows.size === 0) {
      alert("Please select at least one row to delete.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete the selected rows?"
    );
    if (!confirmed) return;

    const updatedTableData = [...tableData];
    const failedDeletes = [];

    for (const rowIndex of selectedRows) {
      const rowId = tableData[rowIndex]?.id;
      if (!rowId) {
        failedDeletes.push(rowIndex);
        continue;
      }

      try {
        await axios.delete("http://localhost:5000/api/deleteRecord", {
          data: {
            tableName: selectedTable,
            whereCondition: `id=${rowId}`,
          },
        });
        updatedTableData[rowIndex] = null; // Mark row as deleted
      } catch (err) {
        console.error(`Failed to delete row with ID ${rowId}:`, err.message);
        failedDeletes.push(rowIndex);
      }
    }

    setTableData(updatedTableData.filter((row) => row !== null));
    setSelectedRows(new Set());

    if (failedDeletes.length > 0) {
      alert(`Failed to delete ${failedDeletes.length} row(s).`);
    } else {
      alert("Selected rows deleted successfully.");
    }
  };

  // Add a new row
  const handleAddRow = () => {
    const newRow = {};
    tableHeaders.forEach((header) => {
      newRow[header] =
        header.toLowerCase() === "id" ? null : ""; // Set ID to null, others to empty
    });
    setTableData((prevData) => [...prevData, newRow]);
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200">
        <Sidebar />
      </div>

      <div className="w-3/4 h-screen flex flex-col p-6 bg-gray-50">
        <div className="w-full max-w-4xl bg-white p-3 shadow-lg rounded-md mb-4">
          <div className="flex justify-between items-center mb-3 space-x-4">
            <h1 className="text-base font-semibold text-gray-700 flex-1">
              {selectedTable || "Select a Table"}
            </h1>
            {selectedTable && (
              <div className="flex items-center space-x-3">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
                  onClick={handleAddRow}
                >
                  Add
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
                  onClick={handleDeleteRows}
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <select
            id="tableDropdown"
            onChange={handleTableChange}
            value={selectedTable}
            className="w-60 text-sm p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mt-3"
          >
            <option value="">-- Choose a Table --</option>
            {tables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>

        {selectedTable && (
          <div className="w-full overflow-auto shadow-md bg-white rounded-md p-4">
            {tableHeaders.length > 0 ? (
              <table className="table-auto w-full max-w-3xl border-collapse text-sm">
                <thead
                  ref={headerRef}
                  className={`bg-gray-200 text-gray-700 ${
                    isHeaderSticky ? "sticky top-0 z-50 font-bold shadow-lg" : ""
                  }`}
                >
                  <tr>
                    <th className="border border-gray-300 px-2 py-2 text-center">
                      Select
                    </th>
                    {tableHeaders.map((header) => (
                      <th
                        key={header}
                        className="border border-gray-300 px-2 py-2 text-center"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody ref={tableBodyRef}>
                  {tableData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="odd:bg-white even:bg-gray-50"
                    >
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(rowIndex)}
                          onChange={() => handleCheckboxChange(rowIndex)}
                        />
                      </td>
                      {tableHeaders.map((header) => (
                        <td
                          key={header}
                          className="border border-gray-300 px-2 py-2 text-center"
                        >
                          {selectedRows.has(rowIndex) ? (
                            header.toLowerCase() === "id" ? (
                              row[header]
                            ) : (
                              <input
                                type="text"
                                value={row[header]}
                                onChange={(e) =>
                                  handleCellChange(e, rowIndex, header)
                                }
                                className="w-full px-1 border border-gray-300 rounded"
                              />
                            )
                          ) : (
                            row[header]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-600">
                No data available for the selected table.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableDropdown;
