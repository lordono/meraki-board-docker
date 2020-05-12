const express = require("express");
const controller = require("./controller");

const router = express.Router();

// routes
router.get("/dns/reverse", controller.dns_reverse);

router.get(
  "/meraki/organizations/:organization/networks",
  controller.meraki_org_network
);

module.exports = router;
