import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Papa from "papaparse";
import _ from "lodash";
import Loader from "./Loader"; // Import the Loader component

function DataInfo() {
  const [data, setData] = useState([]);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [newEntry, setNewEntry] = useState({
    age: "",
    pregnancies: "",
    glucose: "",
    bloodPressure: "",
    insulin: "",
    bmi: "",
    skinThickness: "",
    dpf: "",
  });

  // Fetch the initial data from the CSV file
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/diabetes.csv");
        const csvData = await response.text();
        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            setData(results.data);
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSort = (columnName) => {
    if (sortedColumn === columnName) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(columnName);
      setSortDirection("asc");
    }
  };

  const sortedData = _.orderBy(data, sortedColumn, sortDirection);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({
      ...newEntry,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send new entry to the backend to update the CSV
    try {
      const response = await fetch("/update-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Data added successfully!");
        // After adding, refresh data
        fetchData();
        setNewEntry({
          age: "",
          pregnancies: "",
          glucose: "",
          bloodPressure: "",
          insulin: "",
          bmi: "",
          skinThickness: "",
          dpf: "",
        });
      } else {
        console.error("Failed to add data:", result.message);
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  return (
    <div className="container mx-auto my-8">
      <motion.h1
        initial={{ opacity: 0, y: 150 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 1,
          type: "spring",
          stiffness: 100,
          delay: 0.5,
        }}
        className="text-3xl font-bold mb-4 text-purple-800 text-center p-2 border-b-2"
      >
        Data Information
      </motion.h1>
      
      {data.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            type: "spring",
            stiffness: 100,
            delay: 0.5,
          }}
          className="overflow-x-auto overflow-y-auto rounded-lg shadow-lg mx-10"
          style={{ maxHeight: "420px" }}
        >
          <div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((header, index) => (
                    <th
                      key={index}
                      onClick={() => handleSort(header)}
                      className="px-4 py-2 bg-purple-100 text-purple-800 sticky top-0 font-bold border cursor-pointer relative"
                    >
                      {header}
                      <span className="absolute right-0 top-1/2 transform -translate-y-1/2">
                        {sortedColumn === header
                          ? sortDirection === "asc"
                            ? " ▲"
                            : " ▼"
                          : "▼"}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, index) => (
                      <td key={index} className="px-4 py-2 border">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <Loader /> // Display the loader while data is being fetched
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-purple-800 text-center mb-4">
          Add New Data
        </h2>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="age"
              value={newEntry.age}
              onChange={handleChange}
              placeholder="Age"
              className="px-4 py-2 border rounded-md"
              required
            />
            <input
              type="number"
              name="pregnancies"
              value={newEntry.pregnancies}
              onChange={handleChange}
              placeholder="Pregnancies"
              className="px-4 py-2 border rounded-md"
              required
            />
            <input
              type="number"
              name="glucose"
              value={newEntry.glucose}
              onChange={handleChange}
              placeholder="Glucose"
              className="px-4 py-2 border rounded-md"
              required
            />
            <input
              type="number"
              name="bloodPressure"
              value={newEntry.bloodPressure}
              onChange={handleChange}
              placeholder="Blood Pressure"
              className="px-4 py-2 border rounded-md"
              required
            />
            <input
              type="number"
              name="insulin"
              value={newEntry.insulin}
              onChange={handleChange}
              placeholder="Insulin"
              className="px-4 py-2 border rounded-md"
              required
            />
            <input
              type="number"
              name="bmi"
              value={newEntry.bmi}
              onChange={handleChange}
              placeholder="BMI"
              className="px-4 py-2 border rounded-md"
              required
            />
            <input
              type="number"
              name="skinThickness"
              value={newEntry.skinThickness}
              onChange={handleChange}
              placeholder="Skin Thickness"
              className="px-4 py-2 border rounded-md"
              required
            />
            <input
              type="number"
              name="dpf"
              value={newEntry.dpf}
              onChange={handleChange}
              placeholder="DPF"
              className="px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="text-center mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DataInfo;
