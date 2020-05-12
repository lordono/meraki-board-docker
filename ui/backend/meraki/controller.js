const fetch = require("node-fetch");

/**
 * Mimic Meraki URI for organization networks
 */
exports.org_network = async (req, res) => {
  const { organization } = req.params;
  const baseUrl = process.env.MERAKI_URL;
  const merakiKey = process.env.MERAKI_KEY;
  const response = await fetch(
    `${baseUrl}/organizations/${organization}/networks`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "X-Cisco-Meraki-API-Key": merakiKey,
      },
    }
  );
  const rjson = await response.json();
  return res.json(rjson);
};
