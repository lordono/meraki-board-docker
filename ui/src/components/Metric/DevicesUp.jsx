import React from "react";
import Metric from "./Metric";

const MetricDevicesUp = ({ devicesAll = [], devicesDown = [] }) => {
  return (
    <Metric title="Devices Up" value={devicesAll.length - devicesDown.length} />
  );
};

export default MetricDevicesUp;
