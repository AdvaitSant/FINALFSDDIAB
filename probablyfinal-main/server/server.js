// /server/server.js

const express = require("express");
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const app = express();
app.use(express.json());

// Endpoint to update CSV file with new data
app.post("/update-csv", (req, res) => {
  const newEntry = req.body;
  const filePath = path.join(__dirname, "data", "diabetes.csv");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading CSV file:", err);
      return res.status(500).json({ message: "Error reading CSV file" });
    }

    // Parse the CSV to an object
    Papa.parse(data, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        // Add the new entry
        result.data.push(newEntry);

        // Convert the updated data back to CSV
        const updatedCsv = Papa.unparse(result.data);

        // Write the updated CSV back to the file
        fs.writeFile(filePath, updatedCsv, (err) => {
          if (err) {
            console.error("Error writing CSV file:", err);
            return res.status(500).json({ message: "Error writing CSV file" });
          }
          res.status(200).json({ message: "CSV updated successfully" });
        });
      },
    });
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
