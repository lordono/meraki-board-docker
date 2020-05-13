import React, { useState, useEffect } from "react";
import Line from "./Line";
import { findNameForSerial } from "../../misc";

const LinePerformance = ({ data = [], devices = [] }) => {
  const [lineData, setLineData] = useState([]);
  const [label] = useState("Performance (Score)");
  useEffect(() => {
    if (data) {
      // transform label - from serial to name
      if (devices.length > 0) {
        const transformedData = data.map((i) => {
          const label = findNameForSerial(i.serial, devices);
          return {
            label,
            data: i.data,
          };
        });
        setLineData(transformedData);
      } else {
        setLineData(data);
      }
    }
  }, [data, devices]);
  return (
    <div className="line">
      <Line
        title="Performance Score"
        data={lineData}
        height={6}
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

export default LinePerformance;
