const _ = require("lodash");
const models = require("./models");
const fs = require("fs");
const neatCsv = require("neat-csv");
const https = require("https");

async function fetchData() {
  const currentDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Taipei" })
  );
  const currentHour = currentDate.getHours();
  const currentWeekDay = currentDate.getDay();
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
          if (s.maskAdult > maskAdult) {
            s.saleLog[currentWeekDay] = s.saleLog[currentWeekDay] || {};
            s.saleLog[currentWeekDay][currentHour] =
              s.saleLog[currentWeekDay][currentHour] || 0;
            s.saleLog[currentWeekDay][currentHour] += s.maskAdult - maskAdult;
            s.saleLog["near"] = {
              time: new Date().getTime(),
              number: s.maskAdult - maskAdult
            };
            if (maskAdult == 0)
              s.saleLog[currentWeekDay]["soldOut"] = currentHour;
            s.markModified("saleLog");
          }
          if (maskAdult > s.maskAdult) {
            s.saleLog[currentWeekDay] = s.saleLog[currentWeekDay] || {};
            s.saleLog[currentWeekDay]["add"] = {
              currentHour,
              number: maskAdult - s.maskAdult
            };
            s.markModified("saleLog");
          }
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
