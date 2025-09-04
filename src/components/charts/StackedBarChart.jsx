import React, { useMemo } from "react";
import { Chart } from "react-google-charts";

function StackedBarChart({ data, masterData }) {
  // Transform Recharts data to Google Charts format
  const chartData = useMemo(() => {
    if (!masterData) return [["Client"]];

    if (!data || data.length === 0) {
      // Provide header with all labels but no data rows
      return [["Client", ...masterData.map((item) => item.label), { role: "annotation" }]];
    }    

    // First row = header: "Client", then each stack label
    const header = ["Client", ...masterData.map((item) => item.label), { role: "annotation" }];
    const rows = data.map((d) => {
      const total = masterData.reduce((sum, item) => sum + Number(d[item.value] || 0), 0);
      return [
        String(d.client).length > 10 ? String(d.client).slice(0, 10) + "..." : String(d.client),
        ...masterData.map((item) => Number(d[item.value] || 0)),
        total, // this will appear on top of the stacked bar
      ];
    });

    return [header, ...rows];
  }, [data, masterData]);

  const colors = masterData.map((item) => item.color || "#8884d8");

  const options = {
    chartArea: { width: "70%", height: "70%" },
    isStacked: true,
    hAxis: { title: "Tasks", minValue: 0 },
    vAxis: { title: "Client" },
    legend: { position: "bottom", textStyle: { fontSize: 14 } },
    colors: colors,
    annotations: { alwaysOutside: true, textStyle: { fontSize: 14, bold: true, color: "black" } },
  };

  return (
    <Chart
      chartType="BarChart"
      width="100%"
      height="300px"
      data={chartData}
      options={options}
    />
  );
}

export default StackedBarChart;