const dnsController = require("./dns/controller");
const merakiController = require("./meraki/controller");

exports.dns_reverse = (req, res) => dnsController.reverse(req, res);
exports.meraki_org_network = (req, res) =>
  merakiController.org_network(req, res);
