require("./news");
const { updateStores, map } = require("./mask-helper");

function moveAndSearch({ lat, lng, storeId }) {
  map.panTo([lat, lng]);
  updateStores({ location: { lat, lng }, storeId });
}

function locateSuccess(pos) {
  const crd = pos.coords;
  const location = { lat: crd.latitude, lng: crd.longitude };
  map.setUserLocation(location);
  moveAndSearch(location);
}
function locateError(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  updateStores();
}

function getParams() {
  const queryDict = {};
  location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      queryDict[item.split("=")[0]] = item.split("=")[1];
    });
  return queryDict;
}

function buyCondition() {
  const weekDay = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Taipei" })
  ).getDay();
  let conditionHtml = "";
  // if (weekDay === 0) {
  //   conditionHtml = "不限";
  // } else if (weekDay % 2 === 0) {
  //   conditionHtml = "偶數 <span>(0,2,4,6,8)</span>";
  // } else {
  //   conditionHtml = "奇數 <span>(1,3,5,7,9)</span>";
  // }

  conditionHtml = "不限";
  $("#condition").html(conditionHtml);
}

function init() {
  const urlParams = getParams();
  const { lat, lng, storeId } = urlParams;
  if (lat && lng) {
    moveAndSearch({ lat, lng, storeId });
  } else {
    $("#locate").click();
  }
}

module.exports = (function bootstrap() {
  $("#locate").on("click", function () {
    navigator.geolocation.getCurrentPosition(locateSuccess, locateError, {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    });
  });

  $("#list").on("click", "li", function (e) {
    const code = $(this).attr("data-id");
    const marker = map.markers[code];
    if (marker) {
      map.panTo(marker.getLatLng());
      marker.openPopup();
    }
  });

  $("#search").on("click", () => {
    updateStores();
  });

  $("#logo").on("click", function () {
    $("#about").toggle();
  });

  $("#close").on("click", function () {
    $("#about").hide();
  });

  $("#note").on("click", function (e) {
    if (e.target.id === "note" || e.target.id === "closeNote") {
      $(this).addClass("small");
    } else {
      $(this).removeClass("small");
    }
  });

  $("#closeNews").on("click", function () {
    $("#news").hide();
  });

  buyCondition();
  init();
})();
