import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { colors } from "../../colors";

// const generateHex = () => Math.floor(Math.random() * 16777215).toString(16);

// const generateNewRgb = (existingColors) => {
//   let hex = generateHex();
//   while (hex) {
//     if (!existingColors.includes(hex)) {
//       const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//       if (result) {
//         const rgb = `${parseInt(result[1], 16)},${parseInt(
//           result[2],
//           16
//         )},${parseInt(result[3], 16)}`;
//         return {
//           alpha: `rgba(${rgb},0.4)`,
//           normal: `rgba(${rgb},1)`,
//           hex,
//         };
//       }
//     }
//   }
// };

const defaultDataset = {
  label: "My First dataset",
  fill: false,
  lineTension: 0.1,
  backgroundColor: "rgba(75,192,192,0.4)",
  borderColor: "rgba(75,192,192,1)",
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: "miter",
  pointBorderColor: "rgba(75,192,192,1)",
  pointBackgroundColor: "#fff",
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: "rgba(75,192,192,1)",
  pointHoverBorderColor: "rgba(220,220,220,1)",
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
};

const LineComponent = ({ data, options = {}, width = 50, height = 10 }) => {
  const [lineData, setLineData] = useState({});
  useEffect(() => {
    // Shuffle colors
    const shuffled = colors.sort(() => 0.5 - Math.random());
    const selectedColors = shuffled.slice(0, data.length);
    setLineData({
      datasets: data.map((item, num) => {
        const color = selectedColors[num];
        return {
          ...defaultDataset,
          backgroundColor: color.alpha,
          borderColor: color.normal,
          pointBorderColor: color.normal,
          pointHoverBackgroundColor: color.normal,
          label: item.label,
          data: item.data.map((i) => ({ x: i.x, y: i.y })),
        };
      }),
    });
  }, [data]);

  return (
    <div className="line">
      <Line
        redraw={false}
        data={lineData}
        // width={width}
        // height={height}
        options={{
          maintainAspectRatio: false,
          ...options,
        }}
      />
    </div>
  );
};

export default LineComponent;
