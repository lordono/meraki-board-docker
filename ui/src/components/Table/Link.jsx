import React from "react";

const headers = ["serial", "model", "interface", "status", "timestamp"];

const TableLink = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((i) => (
            <th key={i}>{i}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((i) => {
          return (
            <tr key={i.timestamp}>
              {headers.map((j) => (
                <td key={`${j}-${i.timestamp}`}>{i[j]}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TableLink;
