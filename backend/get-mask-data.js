const _ = require("lodash");
const models = require("./models");
const fs = require("fs");
const neatCsv = require("neat-csv");
const https = require("https");

async function fetchData() {
  const currentHour = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Taipei" })
  ).getHours();
  if (currentHour >= 23 || currentHour < 7) {
    setTimeout(fetchData, 300000);
    return;
  }

  const { Store } = models;
  const file = fs.createWriteStream("./maskdata.csv");
  console.log(`${new Date()}: start fetch maskData`);
  https.get("https://data.nhi.gov.tw/resource/mask/maskdata.csv", response => {
    var stream = response.pipe(file);

    stream.on("finish", async function() {
      console.log("download done");
      console.log("start insert");
      const r = fs.readFileSync("./maskdata.csv");
      const datas = await neatCsv(r);
      const dataChunks = _.chunk(datas, 20);
      for (const dataChunk of dataChunks) {
        const r = dataChunk.map(async store => {
          const [
            code,
            name,
            address,
            _phone,
            maskAdult,
            maskChild,
            updatedAt
          ] = _.values(store);
          let s = await Store.findById(code);
          if (!s) s = new Store({ _id: code });
          if (!s.name) s.name = name;
          if (!s.address) s.address = address;
          s.maskAdult = maskAdult;
          s.maskChild = maskChild;
          s.updatedAt = updatedAt;
          if (!s.validateSync()) {
            return s.save();
          } else {
            console.log(store);
          }
        });
        await Promise.all(r);
      }
      console.log(`${new Date()} done`);
      setTimeout(fetchData, 300000);
    });
  });
}
fetchData();
