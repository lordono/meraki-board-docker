import React, { useState, useEffect } from "react";
import Line from "./Line";

const LineDestination = ({ data = [] }) => {
  const [lineData, setLineData] = useState([]);
  const [label, setLabel] = useState("Destinations (Bytes)");
  useEffect(() => {
    if (data) {
      const allBytes = data.reduce((acc, cur) => {
        const yData = cur.data.map((j) => j.y);
        return acc.concat(yData);
      }, []);
      if (allBytes.length > 0) {
        const aveBytes = allBytes.reduce((a, b) => a + b, 0) / allBytes.length;
        if (aveBytes > 1000000) {
          const transformedData = data.map((i) => {
            return {
              label: i.label,
              data: i.data.map((j) => ({
                x: j.x,
                y: (j.y / 1000000).toFixed(2),
              })),
            };
          });
          setLineData(transformedData);
          setLabel("Destinations (MBytes)");
        } else if (aveBytes > 1000) {
          const transformedData = data.map((i) => {
            return {
              label: i.label,
              data: i.data.map((j) => ({
                x: j.x,
                y: (j.y / 1000).toFixed(2),
              })),
            };
          });
          setLineData(transformedData);
          setLabel("Destinations (KBytes)");
        } else {
          setLineData(data);
          setLabel("Destinations (Bytes)");
        }
      } else {
        setLineData([]);
        setLabel("Destinations (Bytes)");
      }
    }
  }, [data]);
  return (
    <div className="line">
      <Line
        title="Traffic Top 5 Destinations"
        data={lineData}
        height={11.5}
        options={{
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: label,
                },
                ticks: {
                  min: 0,
                },
              },
            ],
            xAxes: [
              {
                type: "time",
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 10,
                },
                time: {
                  displayFormats: {
                    millisecond: "H:mm",
                    second: "H:mm",
                    minute: "H:mm",
                    hour: "H:mm",
                    day: "H:mm",
                    week: "H:mm",
                    month: "H:mm",
                    quarter: "H:mm",
                    year: "H:mm",
                  },
                  parser: "YYYY-MM-DDTHH:mm:ss.000Z",
                },
                scaleLabel: {
                  display: false,
                  labelString: "Time",
                },
              },
            ],
          },
        }}
      />
    </div>
  );
};

export default LineDestination;
