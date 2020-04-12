const Map = require("./map");
const Store = require("./store");

const map = Map({
  accessToken:
    "pk.eyJ1IjoicWF6d3N4OTAwNiIsImEiOiJjazY5YzJycHUwZWJnM21xbW4yaXZxYXBvIn0.MUAmAXu6QVP8sgRno-6_mw",
});

async function updateStores(params = {}) {
  const {
    location = map.getCenter(),
    distance = map.getRadius(),
    storeId,
  } = params;
  const stores = await Store.getStores({ location, distance });
  const now = new Date();

  $("#list").html("");
  map.removeStoreMarkers();
  for (const store of stores) {
    console.log(store);
    updateStore(store, { now });
  }

  const marker = map.markers[storeId];
  if (marker) marker.openPopup();
}

function updateStore(store, { now }) {
  const {
    code,
    name,
    lng,
    lat,
    openTime,
    note,
    condition = {},
    saleLog = {},
  } = store;
  let { maskAdult, maskChild } = store;
  const updatedAt = new Date(store.updatedAt);
  let isOutDate = false;
  if ((now - updatedAt) / 1000 > 60 * 60 * 24) isOutDate = true;
  if ((now - updatedAt) / 1000 > 25 * 60) {
    maskAdult = 0;
    maskChild = 0;
  }

  const marker = map.addStoreMarker({
    lat,
    lng,
    icon: isOutDate ? "greyIcon" : "blueIcon",
    customId: code,
  });
  marker.on("click", function () {
    const customId = this.options.customId;
    $("#list").animate({
      scrollTop:
        $(`#list li[data-id=${customId}]`).position().top -
        $("#list li:first").position().top,
    });
  });
  marker.bindPopup(
    generatePopContent({
      name,
      updatedAt,
      maskAdult,
      maskChild,
      saleLog,
      condition,
      now,
    })
  );

  const listItem = generateList({
    condition,
    saleLog,
    now,
    code,
    isOutDate,
    name,
    updatedAt,
    maskAdult,
    maskChild,
  });
  $("#list").append(listItem);
}

function generateList(params) {
  const {
    condition,
    saleLog,
    now,
    code,
    isOutDate,
    name,
    updatedAt,
    maskAdult,
    maskChild,
  } = params;
  const tag = condition.number ? '<span class="tag">號碼牌</span>' : "";

  const { time: nearTime, number: nearNumber } = saleLog.near || {};
  let nearSaleNumber = 0;
  if (nearTime && (now - nearTime) / 1000 < 600)
    nearSaleNumber = nearNumber || 0;

  return `<li data-id="${code}" class="${isOutDate ? "disable" : ""}">
      <h6>
        ${name}
        ${tag}
        <span class="updatedAt">更新時間：${updatedAt.toLocaleString()}</span>
      </h6>
      <div class="maskCountBox">
        <div class="maskCountColumn">
          成人口罩
          <div class="maskCount">${maskAdult}</div>
        </div>
        <div class="maskCountColumn">
          幼兒口罩
          <div class="maskCount">${maskChild}</div>
        </div>
        <div class="maskCountColumn saleLog">
          10分鐘內銷售
          <div class="maskCount">${nearSaleNumber}</div>
        </div>
      </div>
    </li>`;
}

function generatePopContent(params) {
  const {
    name,
    updatedAt,
    maskAdult,
    maskChild,
    saleLog,
    condition,
    now,
  } = params;
  const { number, common } = condition;

  let conditionMsg = "";
  if (number) conditionMsg = `</br><span>* ${number}</span>`;
  if (common) conditionMsg = `</br><span>* ${common}</span>`;

  return `<b>${name}</b></br>
    <span>更新時間：${updatedAt.toLocaleString()}</span></br>
    <span>成人口罩：${maskAdult}</span></br>
    <span>小孩口罩：${maskChild}</span>
    ${conditionMsg}
    ${generateTodaySaleChart({ now, saleLog })}
  `;
}

function generateTodaySaleChart({ now, saleLog }) {
  const currentDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Taipei" })
  );
  const currentDay = currentDate.getDay();
  const todaySaleLogs = saleLog[currentDay] || {};
  const hourSaleLogs = Object.assign({}, todaySaleLogs, { add: 0 });
  const max = Math.max(...Object.values({ max: 0, ...hourSaleLogs }));
  const startHour = 8;
  const endHour = 22;

  let chartLis = "";
  for (let hour = startHour; hour <= endHour; hour++) {
    const number = todaySaleLogs[hour] || 0;
    const height = (number / max) * 100 || 0;
    chartLis += `<li style="height: ${height}%;"><span title="${hour}"></span></li>`;
  }

  return `<div><成人口罩最近銷售情形></div>
    <ul class="chart" title="${max}">
      ${chartLis}
    </ul>`;
}

module.exports = {
  updateStores,
  map,
};
