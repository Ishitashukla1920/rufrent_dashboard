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

  // Render content based on state
  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar renders only once */}
      

      <div className="flex-1 h-screen flex flex-col p-6 bg-gray-50">
        <div className="w-full max-w-4xl bg-white p-3 shadow-lg rounded-md mb-4">
          <div className="flex justify-between items-center mb-3 space-x-4">
            <h1 className="text-base font-semibold text-gray-700 flex-1">
              {selectedTable || "Select a Table"}
            </h1>
            {selectedTable && (
              <div className="flex items-center space-x-3">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
                  onClick={() => {
                    const newRow = {};
                    tableHeaders.forEach((header) => {
                      newRow[header] =
                        header.toLowerCase() === "id" ? null : "";
                    });
                    setTableData((prev) => [...prev, newRow]);
                  }}
                >
                  Add
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                  onClick={() => alert("Save functionality here")}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
                  onClick={() => alert("Delete functionality here")}
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
                    <tr key={rowIndex} className="odd:bg-white even:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(rowIndex)}
                          onChange={() =>
                            setSelectedRows((prev) => {
                              const newSet = new Set(prev);
                              if (newSet.has(rowIndex)) newSet.delete(rowIndex);
                              else newSet.add(rowIndex);
                              return newSet;
                            })
                          }
                        />
                      </td>
                      {tableHeaders.map((header) => (
                        <td
                          key={header}
                          className="border border-gray-300 px-2 py-2 text-center"
                        >
                          {row[header]}
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
