import React, { useState, useRef, useEffect } from "react";
import { Column, Table } from "react-virtualized";
import dayjs from "dayjs";
import "react-virtualized/styles.css"; // only needs to be imported once

const formatTime = (time) => {
  const parsedDate = dayjs(time); // parse
  const formatDate = parsedDate.format("MM-DD HH:mm"); // display
  return formatDate;
};

const WebHook = ({ data }) => {
  const containerRef = useRef(null);
  const [view, setView] = useState("table");
  const [webhook, setWebhook] = useState({});
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const tableData = data.map((i) => ({
    occurredAt: formatTime(i._source.occurredAt),
    network: i._source.networkName,
    alertType: i._source.alertType,
    alertData: i._source.alertData,
    networkUrl: i._source.networkUrl,
  }));
  useEffect(() => {
    if (containerRef.current !== null) {
      setWidth(containerRef.current.getBoundingClientRect().width - 20);
      setHeight(containerRef.current.getBoundingClientRect().height - 50);
    }
  }, [containerRef]);
  return (
    <div
      style={{
        height: "calc(100% - 50px)",
        width: "calc(100% - 20px)",
        padding: "25px 10px",
        overflow: "auto",
      }}
      ref={containerRef}
    >
      {view === "table" && (
        <Table
          width={width}
          height={height}
          headerHeight={50}
          rowHeight={35}
          rowCount={tableData.length}
          rowGetter={({ index }) => tableData[index]}
          onRowClick={({ event, index, rowData }) => {
            setWebhook(rowData);
            console.log(rowData);
            setView("webhook");
          }}
        >
          <Column label="Time" dataKey="occurredAt" width={100} />
          <Column label="Network" dataKey="network" width={125} />
          <Column label="Type" dataKey="alertType" width={width - 225} />
        </Table>
      )}
      {view === "webhook" && Object.keys(webhook).length > 0 && (
        <div className="individual-webhook">
          <button className="back-btn" onClick={() => setView("table")}>
            Back
          </button>
          <div className="title">Type: {webhook.alertType}</div>
          <div className="date">Date: {webhook.occurredAt}</div>
          <div className="network">Network: {webhook.network}</div>
          <a
            href={webhook.networkUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here to go Dashboard
          </a>
          <div className="details">Details:</div>
          <pre>{JSON.stringify(webhook.alertData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default WebHook;
