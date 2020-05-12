import React from "react";
import Metric from "./Metric";

const MetricLatency = ({ linksAll = [], linksDown = [] }) => {
  return <Metric title="Links Up" value={linksAll.length - linksDown.length} />;
};

export default MetricLatency;
