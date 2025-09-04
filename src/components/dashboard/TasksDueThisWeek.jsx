import React from "react";
import { format } from "date-fns";
import styles from "./TasksDueThisWeek.module.css";

const defaultColumns = [
  { key: "serialNo", clientLabel: "Sr" },
  { key: "clientLabel", clientLabel: "Client Name" },
  { key: "title", clientLabel: "Title" },
  { key: "endDate", clientLabel: "Due Date" },
];

const formatDate = (value) => {
    if (!value) return "";
    let jsDate;

    // Firestore Timestamp
    if (value?.seconds) {
    jsDate = new Date(value.seconds * 1000);
    }
    // Already JS Date
    else if (value instanceof Date) {
    jsDate = value;
    } else {
    return value; // fallback (string, etc.)
    }

    return format(jsDate, "dd-MMM-yyyy"); // 21-Aug-2025
};

// Truncate Long Words
const truncateWords = (text, limit = 10) => {
  if (!text) return "";
  const words = text.split("");
  if (words.length <= limit) return text;
  return words.slice(0, limit).join("") + "...";
};

export default function TasksDueThisWeek({
    tasks = [],
    columns = defaultColumns,
}) {
    
  return (
    <>
      {/* Table wrapper */}
      <div className={`relative rounded-lg border overflow-y-auto max-h-60 ${styles.scrollbar}`}>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="sticky top-0 bg-gray-700 text-xs text-gray-100 uppercase z-10">
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className="px-2 py-3 border">
                  {col.clientLabel}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-2 py-3 ${col.key === "client" ? "font-medium text-gray-900 border" : "border"}`}
                  >
                    {col.key === "endDate"
                      ? formatDate(task[col.key]) // format date here
                      : truncateWords(task[col.key], 25)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div> 

    </>
  );
}
