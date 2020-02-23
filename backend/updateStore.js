const _ = require("lodash");
const models = require("./models");
const https = require("https");
const { Store } = models;

async function fetchData() {
  const url =
    "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json";
  console.log(`${new Date()} start`);
  https.get(url, res => {
    let body = "";
    res.on("data", chunk => {
      body += chunk;
    });
    res.on("end", async () => {
      const data = JSON.parse(body);
      const { features } = data;
      for (let feature of features) {
        const { type, properties, geometry } = feature;
        const {
          id,
          name,
          phone,
          address,
          available,
          note,
          custom_note,
          service_periods
        } = properties;
        const { coordinates } = geometry;
        const [lng, lat] = coordinates;
        let s = await Store.findById(id);
        if (!s) s = new Store({ _id: id });
        if (!s.name) s.name = name;
        if (s.address !== address) s.address = address;
        if (s.openTime !== available) s.openTime = available;
        if (s.servicePeriods !== service_periods)
          s.servicePeriods = service_periods;
        let condition = note || custom_note;
        if (condition && condition !== "-") {
          let key = "common";

          if (note.match(/號碼/)) key = "number";
          s.condition = { [key]: note };
        }
        if (!s.location || !s.location.coordinates) {
          s.location = {
            type: "Point",
            coordinates: [lng, lat]
          };
        }
        if (!s.validateSync()) {
          await s.save();
        } else {
          console.log(feature);
        }
      }

      console.log(`${new Date()} done`);
    });
  });
}
fetchData();
