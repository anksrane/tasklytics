import React from 'react'
import { Chart } from "react-google-charts";

function PieChart({ pieData, is3D = true, width = "100%", height = 200 }) {
  if (!pieData || pieData.length <= 1) {
    return <div className="text-center py-4">No data available</div>;
  }

  const options = {
    is3D: is3D,
    pieSliceText: "value",
    legend: { position: "right", alignment: "center" },
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
