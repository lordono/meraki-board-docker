/**
 * Calculate the hours between date1 and date2
 * @param {string} dt1 Start date to search in string format eg. 2020-04-06T09:30:00
 * @param {string} dt2 End date to search in string format eg. 2020-04-06T09:30:00
 */
const getInterval = (dt1, dt2) => {
  const start = Date.parse(dt1);
  const end = Date.parse(dt2);
  let diff = (end - start) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
};

/**
 * Search for data for Traffic Line Graph
 * @param {string} start Start date to search in string format eg. 2020-04-06T09:30:00
 * @param {string} end End date to search in string format eg. 2020-04-06T10:30:00
 */
export const trafficQuery = (start, end) => ({
  query: {
    bool: {
      must_not: {
        term: {
          "source.bytes": 0,
        },
      },
      filter: {
        range: {
          "@timestamp": {
            gte: start,
            lte: end,
          },
        },
      },
    },
  },
  aggs: {
    by_timestamp: {
      date_histogram: {
        field: "@timestamp",
        calendar_interval: getInterval(start, end) > 3 ? "1h" : "1m",
      },
      aggs: {
        by_network_bytes: {
          sum: {
            field: "network.bytes",
          },
        },
      },
    },
  },
});

/**
 * Search for top X data for Bar Graph
 * @param {string} start Start date to search in string format eg. 2020-04-06T09:30:00
 * @param {string} end End date to search in string format eg. 2020-04-06T10:30:00
 * @param {string} field Index to search by - eg. source.ip
 * @param {number} size Number of Top Hits to search for - eg. 5
 */
export const barQuery = (start, end, field, size) => ({
  query: {
    bool: {
      must_not: {
        term: {
          "source.bytes": 0,
        },
      },
      filter: {
        range: {
          "@timestamp": {
            gte: start,
            lte: end,
          },
        },
      },
    },
  },
  aggs: {
    by_ip: {
      terms: {
        field: field,
      },
      aggs: {
        sum_network_bytes: {
          sum: {
            field: "network.bytes",
          },
        },
        bytes_sort: {
          bucket_sort: {
            sort: [
              {
                sum_network_bytes: { order: "desc" },
              },
            ],
            size: size,
          },
        },
      },
    },
  },
});

/**
 * Search for top X data for Line Graph
 * @param {string} start Start date to search in string format eg. 2020-04-06T09:30:00
 * @param {string} end End date to search in string format eg. 2020-04-06T10:30:00
 * @param {string} field Index to search by - eg. source.ip
 * @param {array} tophits Array of strings to search by
 */
export const lineQuery = (start, end, field, tophits) => ({
  query: {
    bool: {
      must: {
        query_string: {
          query: `(${tophits.join(") OR (")})`,
          fields: [field],
        },
      },
      must_not: {
        term: {
          "source.bytes": 0,
        },
      },
      filter: {
        range: {
          "@timestamp": {
            gte: start,
            lte: end,
          },
        },
      },
    },
  },
  aggs: {
    by_ip: {
      terms: {
        field: field,
      },
      aggs: {
        by_timestamp: {
          date_histogram: {
            field: "@timestamp",
            calendar_interval: getInterval(start, end) > 3 ? "1h" : "1m",
          },
          aggs: {
            by_network_bytes: {
              sum: {
                field: "network.bytes",
              },
            },
          },
        },
      },
    },
  },
});

/**
 * Search for perfomance data for Line Graph
 * @param {string} start Start date to search in string format eg. 2020-04-06T09:30:00
 * @param {string} end End date to search in string format eg. 2020-04-06T10:30:00
 */
export const perfQuery = (start, end) => ({
  query: {
    bool: {
      must_not: {
        exists: {
          field: "errors",
        },
      },
      filter: {
        range: {
          "@timestamp": {
            gte: start,
            lte: end,
          },
        },
      },
    },
  },
  aggs: {
    by_serial: {
      terms: {
        field: "serial.keyword",
      },
      aggs: {
        by_serial: {
          date_histogram: {
            field: "@timestamp",
            calendar_interval: getInterval(start, end) > 3 ? "1h" : "1m",
          },
          aggs: {
            avg_perf: {
              avg: {
                field: "perfScore",
              },
            },
          },
        },
      },
    },
  },
});

/**
 * Search for latency data for Line Graph
 * @param {string} start Start date to search in string format eg. 2020-04-06T09:30:00
 * @param {string} end End date to search in string format eg. 2020-04-06T10:30:00
 */
export const latencyQuery = (start, end, field) => ({
  query: {
    bool: {
      filter: {
        range: {
          "@timestamp": {
            gte: start,
            lte: end,
          },
        },
      },
    },
  },
  aggs: {
    by_serial: {
      terms: {
        field: "serial.keyword",
      },
      aggs: {
        by_serial: {
          date_histogram: {
            field: "@timestamp",
            calendar_interval: getInterval(start, end) > 3 ? "1h" : "1m",
          },
          aggs: {
            avg_field: {
              avg: {
                field: field,
              },
            },
          },
        },
      },
    },
  },
});

/**
 * Search for WAN data for Metric Graph
 * @param {string} start Start date to search in string format eg. 2020-04-06T09:30:00
 * @param {string} end End date to search in string format eg. 2020-04-06T10:30:00
 */
export const wanQuery = (start, end) => ({
  query: {
    bool: {
      filter: {
        range: {
          "@timestamp": {
            gte: start,
            lte: end,
          },
        },
      },
    },
  },
  sort: [{ "@timestamp": "desc" }],
  size: 23,
});

/**
 * Search for Webhook Alerts
 * @param {string} start Start date to search in string format eg. 2020-04-06T09:30:00
 * @param {string} end End date to search in string format eg. 2020-04-06T10:30:00
 */
export const alertQuery = (start, end) => ({
  query: {
    bool: {
      filter: {
        range: {
          occurredAt: {
            gte: start,
            lte: end,
          },
        },
      },
    },
  },
  sort: [{ occurredAt: "desc" }],
  size: 100,
});
