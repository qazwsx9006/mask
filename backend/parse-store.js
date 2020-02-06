const models = require("./models/");
const fs = require("fs");
const neatCsv = require("neat-csv");

async function parseStoreCSV() {
  const { Store } = models;
  const r = fs.readFileSync("../drugstore-gps.csv");
  const datas = await neatCsv(r);
  for (const store of datas) {
    const code = store["醫事機構代碼"];
    const name = store["醫事機構名稱"];
    const address = store["地 址 "];
    const openTime = store["固定看診時段 "];
    const note = store["備註"];
    let lat = store["Response_Y"];
    let lng = store["Response_X"];
    if (lat && lng) {
      lat = lat.split(/\n/)[0];
      lng = lng.split(/\n/)[0];
      let s = await Store.findById(code);
      if (!s) s = new Store({ _id: code });
      s.name = name;
      s.address = address;
      s.openTime = openTime;
      s.note = note;
      s.location = { type: "Point", coordinates: [lng, lat] };
      await s.save();
      console.log(s);
    }
  }
  console.log("done");
}
