import React from 'react'
import { Chart } from "react-google-charts";

function PieChart({ pieData, is3D = true, width = "100%", height = 200 }) {
  if (!pieData || pieData.length <= 1) {
    return <div className="text-center py-4">No data available</div>;
  }

  const isDark = document.body.classList.contains("dark");
  const textColor = isDark ? "#FFFFFF" : "#000000"; 
  const textSecondary = isDark ? "#D1D5DB" : "#374151";   

  const options = {
    is3D: is3D,
    backgroundColor: "transparent", // use transparent, chart sits on parent bg
    pieSliceText: "value",
    legend: { 
      position: "right", 
      alignment: "center",
      textStyle: { color: textColor }
    },
    chartArea: { width: "90%", height: "80%" },
    pieSliceTextStyle: { color: textSecondary }
  };
  return (
    <div className="w-full">
      <Chart
        chartType="PieChart"
        data={pieData}
        options={options}
        width={width}
        height={height}
      />
    </div>
  )
}

export default PieChart
