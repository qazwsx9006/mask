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
// // mymap.locate({ setView: true, maxZoom: 16 });

const markers = {};
mymap.panTo([25.049063, 121.554742]);

// 取得地圖半徑 (km)
var mapBoundNorthEast = mymap.getBounds().getNorthEast();
var mapDistance = mapBoundNorthEast.distanceTo(mymap.getCenter());
console.log(mapDistance / 1000);

$("#list").html("");
$("#list").on("click", "li", function(e) {
  const code = $(this).attr("data-id");
  const marker = markers[code];
  mymap.panTo(marker.getLatLng());
});

for (data of fakeApiData) {
  const {
    code,
    name,
    lng,
    lat,
    openTime,
    note,
    maskAdult,
    maskChild,
    updatedAt
  } = data;
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

// var options = {
//   enableHighAccuracy: true,
//   timeout: 5000,
//   maximumAge: 0
// };
// function success(pos) {
//   var crd = pos.coords;
//   mymap.panTo([crd.latitude, crd.longitude]);
// }
// function error(err) {
//   console.warn(`ERROR(${err.code}): ${err.message}`);
// }
// navigator.geolocation.getCurrentPosition(success, error, options);
