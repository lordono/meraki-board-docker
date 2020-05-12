import React, { useState, useEffect } from "react";
import Bar from "./Bar";

const BarDestination = ({ data = [] }) => {
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
        title="MX Top 5 Destinations"
        data={barData}
        height={27.5}
        options={{
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Destinations",
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

export default BarDestination;
