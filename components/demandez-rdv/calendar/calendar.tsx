// import {Calendar} from "@nextui-org/react";

// export default function App() {
//   return <Calendar showMonthAndYearPickers aria-label="Date (Show Month and Year Picker)" />;
// }
"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";


export default function App() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  return (
    <div className="w-full">
      <label htmlFor="datepicker" className="block mb-2 text-sm font-medium text-gray-700">
        Choisissez une date
      </label>
      <DatePicker
        id="datepicker"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="dd/MM/yyyy"
        className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
        placeholderText="Sélectionnez une date"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
    </div>
  );
}
