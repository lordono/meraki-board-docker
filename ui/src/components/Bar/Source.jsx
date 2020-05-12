import React, { useState, useEffect } from "react";
import Bar from "./Bar";

// const data = [
//   { label: "172.20.1.21", data: "242" },
//   { label: "172.16.10.114", data: "30" },
//   { label: "172.217.6.45", data: "24" },
//   { label: "209.206.48.17", data: "10" },
//   { label: "157.240.22.25", data: "5" },
//   { label: "Others", data: "100" },
// ];

const BarSource = ({ data = [] }) => {
  const [barData, setBarData] = useState([]);
  const [label, setLabel] = useState("Data Transmission (Bytes)");
  useEffect(() => {
    if (data) {
      const allBytes = data.reduce((acc, cur) => {
        const yData = cur.data;
        return acc.concat(yData);
      }, []);
      if (allBytes.length > 0) {
        const aveBytes = allBytes.reduce((a, b) => a + b, 0) / allBytes.length;
        if (aveBytes > 1000000) {
          const transformedData = data.map((i) => {
            return {
              label: i.label,
              data: (i.data / 1000000).toFixed(2),
            };
          });
          setBarData(transformedData);
          setLabel("Data Transmission (MBytes)");
        } else if (aveBytes > 1000) {
          const transformedData = data.map((i) => {
            return {
              label: i.label,
              data: (i.data / 1000).toFixed(2),
            };
          });
          setBarData(transformedData);
          setLabel("Data Transmission (KBytes)");
        } else {
          setBarData(data);
          setLabel("Data Transmission (Bytes)");
        }
      } else {
        setBarData([]);
        setLabel("Data Transmission (Bytes)");
      }
    }
  }, [data]);
  return (
    <div className="bar">
      <Bar
        title="MX Top 5 Sources"
        data={barData}
        height={27.5}
        options={{
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Sources",
                },
              },
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: label,
                },
              },
            ],
          },
        }}
      />
    </div>
  );
};

export default BarSource;
