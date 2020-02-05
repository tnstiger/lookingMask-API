const express = require("express");
const router = express.Router();
const { Record, Store, knex } = require("./lib/db.js");
const dayjs = require("dayjs");
const apicache = require("apicache");

let cache = apicache.middleware;

router.post("/api/", async (req, res) => {
  let record = req.body;
  await Record.create(record);
  res.end();
});

router.get("/api/", cache(5000), async (req, res) => {
  let stores = req.query.stores.split(",");
  let records = await Record.query()
    .where("store_id", "in", stores)
    .orderBy("record.created_at", "desc");
  let results = records.map(record => {
    const { id, updated_at, ...result } = record;
    result.created_at = dayjs(String(result.created_at)).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    return result;
  });
  res.json(results);
});

router.post("/api/store/", async (req, res) => {
  let store = req.body;
  await Store.create(store);
  res.end();
});

router.get("/api/store/", cache(5000), async (req, res) => {
  let lat = req.query.lat;
  let lng = req.query.lng;
  let radius = req.query.radius;
  let records = await knex.raw(
    `SELECT *  FROM store where ST_Distance(POINT(lat,lng),POINT(${lat},${lng})) * 111.38 < ${radius /
      1000}`
  );

  res.json(records[0]);
});

module.exports = router;
