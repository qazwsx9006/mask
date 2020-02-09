// socket

const socket = io("https://socketio.weishianglian.com", {
  transports: ["websocket"]
});
socket.on("connect", () => {
  console.log("socket connect!");
});
// socket

const fakeApiData = [
  {
    code: "5901012203",
    name: "博荃藥局",
    lng: 121.544742,
    lat: 25.050063,
    openTime:
      "星期一上午看診、星期二上午看診、星期三上午看診、星期四上午看診、星期五上午看診、星期六上午看診、星期日上午休診、星期一下午看診、星期二下午看診、星期三下午看診、星期四下午看診、星期五下午看診、星期六下午看診、星期日下午休診、星期一晚上看診、星期二晚上看診、星期三晚上看診、星期四晚上看診、星期五晚上看診、星期六晚上看診、星期日晚上休診",
    note: "如遇國定連續假期,藥局公休",
    maskAdult: 20,
    maskChild: 20,
    updatedAt: "2020/02/04"
  },
  {
    code: "5901012383",
    name: "德川中西藥局",
    lng: 121.56066,
    lat: 25.04836,
    openTime:
      "星期一上午看診、星期二上午看診、星期三上午看診、星期四上午看診、星期五上午看診、星期六上午休診、星期日上午休診、星期一下午看診、星期二下午看診、星期三下午看診、星期四下午看診、星期五下午看診、星期六下午休診、星期日下午看診、星期一晚上看診、星期二晚上看診、星期三晚上看診、星期四晚上看診、星期五晚上看診、星期六晚上休診、星期日晚上休診",
    note: "",
    maskAdult: 20,
    maskChild: 20,
    updatedAt: "2020/02/04"
  }
];
const tiles = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken:
      "pk.eyJ1IjoicWF6d3N4OTAwNiIsImEiOiJjazY5YzJycHUwZWJnM21xbW4yaXZxYXBvIn0.MUAmAXu6QVP8sgRno-6_mw"
  }
);
const latLng = L.latLng(25.0479499, 121.5135961);
const mymap = L.map("map", { center: latLng, zoom: 16, layers: [tiles] });

const markers = {};
$("#list").on("click", "li", function(e) {
  const code = $(this).attr("data-id");
  const marker = markers[code];
  if (marker) {
    mymap.panTo(marker.getLatLng());
    marker.openPopup();
  }
});

var options = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0
};
function success(pos) {
  var crd = pos.coords;
  mymap.panTo([crd.latitude, crd.longitude]);
  getStores([crd.latitude, crd.longitude]);
}
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  getStores();
}
$("#locate").on("click", function() {
  // mymap.locate({ setView: true, maxZoom: 16 });
  navigator.geolocation.getCurrentPosition(success, error, options);
});
$("#search").on("click", () => {
  getStores();
});
$("#locate").click();

function getStores(geolocation = []) {
  console.log(geolocation);
  const [lat, lng] = geolocation;
  let location = mymap.getCenter();
  if (lat && lng) {
    location = {
      lat,
      lng
    };
  }
  // 取得地圖半徑 (km)
  const mapBoundNorthEast = mymap.getBounds().getNorthEast();
  const mapDistance = mapBoundNorthEast.distanceTo(mymap.getCenter());
  let distance = mapDistance / 1000;
  if (distance > 5) distance = 5;
  socket.emit(
    "masks",
    {
      lat: location.lat,
      lng: location.lng,
      distance
    },
    data => {
      updateStores(data);
    }
  );
}

function updateStores(stores) {
  $("#list").html("");
  for (const marker of Object.values(markers)) {
    mymap.removeLayer(marker);
  }

  for (data of stores) {
    const { code, name, lng, lat, openTime, note, maskAdult, maskChild } = data;
    const updatedAt = convertUTCToLocalDateIgnoringTimezone(
      new Date(data.updatedAt)
    ).toLocaleString();
    var marker = L.marker([lat, lng], {
      myCustomId: "hello"
    }).addTo(mymap);
    marker.bindPopup(
      `<b>${name}</b></br>
        <span>更新時間：${updatedAt}</span></br>
        <span>成人口罩：${maskAdult}</span></br>
        <span>小孩口罩：${maskChild}</span>`
    );
    markers[code] = marker;
    // marker.setPopupContent("<b>Hello world!</b><br>I am a popup.2222");
    const listItem = `<li data-id="${code}">
      <h6>
        ${name}
        <span>更新時間：${updatedAt}</span>
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
      </div>
    </li>`;
    $("#list").append(listItem);
  }
}

function convertUTCToLocalDateIgnoringTimezone(utcDate) {
  return new Date(
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth(),
    utcDate.getUTCDate(),
    utcDate.getUTCHours(),
    utcDate.getUTCMinutes(),
    utcDate.getUTCSeconds(),
    utcDate.getUTCMilliseconds()
  );
}

function buyCondition() {
  const weekDay = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Taipei" })
  ).getDay();
  let conditionHtml = "";
  if (weekDay === 0) {
    conditionHtml = "不限";
  } else if (weekDay % 2 === 0) {
    conditionHtml = "偶數 <span>(0,2,4,6,8)</span>";
  } else {
    conditionHtml = "奇數 <span>(1,3,5,7,9)</span>";
  }

  $("#condition").html(conditionHtml);
}
buyCondition();

$("#logo").on("click", function() {
  $("#about").toggle();
});
$("#close").on("click", function() {
  $("#about").hide();
});

$("#news").on("click", () => {
  alert("開發中");
});
$("#note").on("click", function(e) {
  if (e.target.id === "note" || e.target.id === "closeNote") {
    $(this).addClass("small");
  } else {
    $(this).removeClass("small");
  }
});
