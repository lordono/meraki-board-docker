import React from "react";
import Metric from "./Metric";

const MetricDevicesDown = ({ devicesDown = [] }) => {
  return <Metric title="Devices Down" value={devicesDown.length} />;
};

export default MetricDevicesDown;
