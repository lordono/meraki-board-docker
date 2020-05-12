import React from "react";
import Metric from "./Metric";

const MetricPerformance = ({ linksAll = [], linksDown = [] }) => {
  return <Metric title="Links Up" value={linksAll.length - linksDown.length} />;
};

export default MetricPerformance;
