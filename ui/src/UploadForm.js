import React from "react";
import * as XLSX from "xlsx";
import { useState } from "react";

const UploadForm = () => {
  const [phoneNumbers, setPhoneNumbers] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Extract phone numbers from the first column and limit to 1000 records
        const phoneNumbers = jsonData.slice(0, 1000).map((row) => row[0]);
        setPhoneNumbers(phoneNumbers);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = () => {
    axios
      .post("sms-production-c788.up.railway.app/text", { phoneNumbers })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <h3>Upload list of phone numbers</h3>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <button onClick={handleSubmit}>submit</button>
      {phoneNumbers.length > 0 && (
        <div>
          <h2>Phone Numbers</h2>
          <ul>
            {phoneNumbers.map((number, index) => (
              <li key={index}>{number}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
