import React, { useState, useEffect } from "react";
import { HorizontalBar } from "react-chartjs-2";

const Bar = ({
  title = "Initial Dataset",
  data,
  options = {},
  width = 50,
  height = 25,
}) => {
  const [barData, setBarData] = useState({});

  useEffect(() => {
    setBarData({
      labels: data.map((i) => i.label),
      datasets: [
        {
          label: title,
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: data.map((i) => i.data),
        },
      ],
    });
  }, [title, data]);

  return (
    <div className="bar">
      <HorizontalBar
        data={barData}
        width={width}
        height={height}
        options={{
          maintainAspectRatio: true,
          legend: { display: false },
          ...options,
        }}
      />
    </div>
  );
};

export default Bar;
