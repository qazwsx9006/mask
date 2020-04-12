/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./javascripts */ \"./src/javascripts/index.js\");\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/javascripts/index.js":
/*!**********************************!*\
  !*** ./src/javascripts/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./news */ \"./src/javascripts/news.js\");\nconst { updateStores, map } = __webpack_require__(/*! ./mask-helper */ \"./src/javascripts/mask-helper.js\");\n\nfunction moveAndSearch({ lat, lng, storeId }) {\n  map.panTo([lat, lng]);\n  updateStores({ location: { lat, lng }, storeId });\n}\n\nfunction locateSuccess(pos) {\n  const crd = pos.coords;\n  const location = { lat: crd.latitude, lng: crd.longitude };\n  map.setUserLocation(location);\n  moveAndSearch(location);\n}\nfunction locateError(err) {\n  console.warn(`ERROR(${err.code}): ${err.message}`);\n  updateStores();\n}\n\nfunction getParams() {\n  const queryDict = {};\n  location.search\n    .substr(1)\n    .split(\"&\")\n    .forEach(function (item) {\n      queryDict[item.split(\"=\")[0]] = item.split(\"=\")[1];\n    });\n  return queryDict;\n}\n\nfunction buyCondition() {\n  const weekDay = new Date(\n    new Date().toLocaleString(\"en-US\", { timeZone: \"Asia/Taipei\" })\n  ).getDay();\n  let conditionHtml = \"\";\n  // if (weekDay === 0) {\n  //   conditionHtml = \"不限\";\n  // } else if (weekDay % 2 === 0) {\n  //   conditionHtml = \"偶數 <span>(0,2,4,6,8)</span>\";\n  // } else {\n  //   conditionHtml = \"奇數 <span>(1,3,5,7,9)</span>\";\n  // }\n\n  conditionHtml = \"不限\";\n  $(\"#condition\").html(conditionHtml);\n}\n\nfunction init() {\n  const urlParams = getParams();\n  const { lat, lng, storeId } = urlParams;\n  if (lat && lng) {\n    moveAndSearch({ lat, lng, storeId });\n  } else {\n    $(\"#locate\").click();\n  }\n}\n\nmodule.exports = (function bootstrap() {\n  $(\"#locate\").on(\"click\", function () {\n    navigator.geolocation.getCurrentPosition(locateSuccess, locateError, {\n      enableHighAccuracy: true,\n      timeout: 8000,\n      maximumAge: 0,\n    });\n  });\n\n  $(\"#list\").on(\"click\", \"li\", function (e) {\n    const code = $(this).attr(\"data-id\");\n    const marker = map.markers[code];\n    if (marker) {\n      map.panTo(marker.getLatLng());\n      marker.openPopup();\n    }\n  });\n\n  $(\"#search\").on(\"click\", () => {\n    updateStores();\n  });\n\n  $(\"#logo\").on(\"click\", function () {\n    $(\"#about\").toggle();\n  });\n\n  $(\"#close\").on(\"click\", function () {\n    $(\"#about\").hide();\n  });\n\n  $(\"#note\").on(\"click\", function (e) {\n    if (e.target.id === \"note\" || e.target.id === \"closeNote\") {\n      $(this).addClass(\"small\");\n    } else {\n      $(this).removeClass(\"small\");\n    }\n  });\n\n  $(\"#closeNews\").on(\"click\", function () {\n    $(\"#news\").hide();\n  });\n\n  buyCondition();\n  init();\n})();\n\n\n//# sourceURL=webpack:///./src/javascripts/index.js?");

/***/ }),

/***/ "./src/javascripts/map.js":
/*!********************************!*\
  !*** ./src/javascripts/map.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function initMap(params = {}) {\n  const customIcons = {\n    blueIcon: new L.Icon({\n      iconUrl: \"./assets/images/marker-icon-2x-blue.png\",\n      shadowUrl: \"./assets/images/marker-shadow.png\",\n      iconSize: [25, 41],\n      iconAnchor: [12, 41],\n      popupAnchor: [1, -34],\n      shadowSize: [41, 41],\n    }),\n    greyIcon: new L.Icon({\n      iconUrl: \"./assets/images/marker-icon-2x-grey.png\",\n      shadowUrl: \"./assets/images/marker-shadow.png\",\n      iconSize: [25, 41],\n      iconAnchor: [12, 41],\n      popupAnchor: [1, -34],\n      shadowSize: [41, 41],\n    }),\n    locateIcon: new L.divIcon({\n      className: \"user-icon\",\n      html: \"<div class='user-icon-marker'></div>\",\n      iconSize: [30, 30],\n    }),\n  };\n\n  let map;\n  let userMarker;\n  let markers = {};\n\n  function createMap(params = {}) {\n    const options = {\n      ...{\n        url:\n          \"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}\",\n        attribution:\n          'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',\n        zoom: 16,\n        maxZoom: 18,\n        id: \"mapbox/streets-v11\",\n        center: { lat: 25.0479499, lng: 121.5135961 },\n        accessToken: \"\", // 必填值\n      },\n      ...params,\n    };\n\n    const tiles = L.tileLayer(options.url, {\n      attribution: options.attribution,\n      maxZoom: options.maxZoom,\n      id: options.id,\n      accessToken: options.accessToken,\n    });\n    const { center } = options;\n    const latLng = L.latLng(center.lat, center.lng);\n    return L.map(\"map\", {\n      center: latLng,\n      zoom: options.zoom,\n      layers: [tiles],\n    });\n  }\n\n  function setUserLocation({ lat, lng }) {\n    if (userMarker) {\n      userMarker.setLatLng([lat, lng]);\n    } else {\n      userMarker = L.marker([lat, lng], {\n        icon: customIcons.locateIcon,\n      }).addTo(map);\n    }\n    return userMarker;\n  }\n\n  function removeStoreMarkers() {\n    for (const marker of Object.values(markers)) {\n      map.removeLayer(marker);\n    }\n    markers = {};\n    return markers;\n  }\n\n  function addStoreMarker(params = {}) {\n    const { lat, lng, icon, customId } = params;\n    const markerIcon = customIcons[icon] || greyIcon;\n    const marker = L.marker([lat, lng], {\n      icon: markerIcon,\n      customId,\n    }).addTo(map);\n    markers[customId] = marker;\n    return marker;\n  }\n\n  function getRadius() {\n    const mapBoundNorthEast = map.getBounds().getNorthEast();\n    // m\n    const mapDistance = mapBoundNorthEast.distanceTo(map.getCenter());\n    // km\n    return mapDistance / 1000;\n  }\n\n  map = createMap(params);\n  return {\n    map,\n    markers,\n    userMarker,\n    setUserLocation,\n    removeStoreMarkers,\n    addStoreMarker,\n    getRadius,\n    getCenter: map.getCenter.bind(map),\n    panTo: map.panTo.bind(map),\n  };\n};\n\n\n//# sourceURL=webpack:///./src/javascripts/map.js?");

/***/ }),

/***/ "./src/javascripts/mask-helper.js":
/*!****************************************!*\
  !*** ./src/javascripts/mask-helper.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Map = __webpack_require__(/*! ./map */ \"./src/javascripts/map.js\");\nconst Store = __webpack_require__(/*! ./store */ \"./src/javascripts/store.js\");\n\nconst map = Map({\n  accessToken:\n    \"pk.eyJ1IjoicWF6d3N4OTAwNiIsImEiOiJjazY5YzJycHUwZWJnM21xbW4yaXZxYXBvIn0.MUAmAXu6QVP8sgRno-6_mw\",\n});\n\nasync function updateStores(params = {}) {\n  const {\n    location = map.getCenter(),\n    distance = map.getRadius(),\n    storeId,\n  } = params;\n  const stores = await Store.getStores({ location, distance });\n  const now = new Date();\n\n  $(\"#list\").html(\"\");\n  map.removeStoreMarkers();\n  for (const store of stores) {\n    updateStore(store, { now });\n  }\n\n  const marker = map.markers[storeId];\n  if (marker) marker.openPopup();\n}\n\nfunction updateStore(store, { now }) {\n  const {\n    code,\n    name,\n    lng,\n    lat,\n    openTime,\n    note,\n    maskAdult,\n    maskChild,\n    condition = {},\n    saleLog = {},\n  } = store;\n  const updatedAt = new Date(store.updatedAt);\n  let isOutDate = false;\n  if ((new Date() - updatedAt) / 1000 > 60 * 60 * 24) isOutDate = true;\n\n  const marker = map.addStoreMarker({\n    lat,\n    lng,\n    icon: isOutDate ? \"greyIcon\" : \"blueIcon\",\n    customId: code,\n  });\n  marker.on(\"click\", function () {\n    const customId = this.options.customId;\n    $(\"#list\").animate({\n      scrollTop:\n        $(`#list li[data-id=${customId}]`).position().top -\n        $(\"#list li:first\").position().top,\n    });\n  });\n  marker.bindPopup(\n    generatePopContent({\n      name,\n      updatedAt,\n      maskAdult,\n      maskChild,\n      saleLog,\n      condition,\n      now,\n    })\n  );\n\n  const listItem = generateList({\n    condition,\n    saleLog,\n    now,\n    code,\n    isOutDate,\n    name,\n    updatedAt,\n    maskAdult,\n    maskChild,\n  });\n  $(\"#list\").append(listItem);\n}\n\nfunction generateList(params) {\n  const {\n    condition,\n    saleLog,\n    now,\n    code,\n    isOutDate,\n    name,\n    updatedAt,\n    maskAdult,\n    maskChild,\n  } = params;\n  const tag = condition.number ? '<span class=\"tag\">號碼牌</span>' : \"\";\n\n  const { time: nearTime, number: nearNumber } = saleLog.near || {};\n  let nearSaleNumber = 0;\n  if (nearTime && (now - nearTime) / 1000 < 600)\n    nearSaleNumber = nearNumber || 0;\n\n  return `<li data-id=\"${code}\" class=\"${isOutDate ? \"disable\" : \"\"}\">\n      <h6>\n        ${name}\n        ${tag}\n        <span class=\"updatedAt\">更新時間：${updatedAt.toLocaleString()}</span>\n      </h6>\n      <div class=\"maskCountBox\">\n        <div class=\"maskCountColumn\">\n          成人口罩\n          <div class=\"maskCount\">${maskAdult}</div>\n        </div>\n        <div class=\"maskCountColumn\">\n          幼兒口罩\n          <div class=\"maskCount\">${maskChild}</div>\n        </div>\n        <div class=\"maskCountColumn saleLog\">\n          10分鐘內銷售\n          <div class=\"maskCount\">${nearSaleNumber}</div>\n        </div>\n      </div>\n    </li>`;\n}\n\nfunction generatePopContent(params) {\n  const {\n    name,\n    updatedAt,\n    maskAdult,\n    maskChild,\n    saleLog,\n    condition,\n    now,\n  } = params;\n  const { number, common } = condition;\n\n  let conditionMsg = \"\";\n  if (number) conditionMsg = `</br><span>* ${number}</span>`;\n  if (common) conditionMsg = `</br><span>* ${common}</span>`;\n\n  return `<b>${name}</b></br>\n    <span>更新時間：${updatedAt.toLocaleString()}</span></br>\n    <span>成人口罩：${maskAdult}</span></br>\n    <span>小孩口罩：${maskChild}</span>\n    ${conditionMsg}\n    ${generateTodaySaleChart({ now, saleLog })}\n  `;\n}\n\nfunction generateTodaySaleChart({ now, saleLog }) {\n  const currentDate = new Date(\n    now.toLocaleString(\"en-US\", { timeZone: \"Asia/Taipei\" })\n  );\n  const currentDay = currentDate.getDay();\n  const todaySaleLogs = saleLog[currentDay] || {};\n  const hourSaleLogs = Object.assign({}, todaySaleLogs, { add: 0 });\n  const max = Math.max(...Object.values({ max: 0, ...hourSaleLogs }));\n  const startHour = 8;\n  const endHour = 22;\n\n  let chartLis = \"\";\n  for (let hour = startHour; hour <= endHour; hour++) {\n    const number = todaySaleLogs[hour] || 0;\n    const height = (number / max) * 100 || 0;\n    chartLis += `<li style=\"height: ${height}%;\"><span title=\"${hour}\"></span></li>`;\n  }\n\n  return `<div><成人口罩最近銷售情形></div>\n    <ul class=\"chart\" title=\"${max}\">\n      ${chartLis}\n    </ul>`;\n}\n\nmodule.exports = {\n  updateStores,\n  map,\n};\n\n\n//# sourceURL=webpack:///./src/javascripts/mask-helper.js?");

/***/ }),

/***/ "./src/javascripts/news.js":
/*!*********************************!*\
  !*** ./src/javascripts/news.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function insertImages() {\n  const imageLists = [\n    \"https://i.imgur.com/jQsJk5C.jpg\",\n    \"https://i.imgur.com/xaMWo8F.png\",\n    \"https://i.imgur.com/7ZSglpc.jpg\",\n    \"https://i.imgur.com/EckthZB.png\",\n    \"https://i.imgur.com/cP2ru0G.jpg\",\n    \"https://i.imgur.com/QNl3Yh7.jpg\",\n    \"https://i.imgur.com/LMdfruc.jpg\",\n    \"https://i.imgur.com/ob4nIJU.jpg\",\n  ];\n\n  for (let imageUrl of imageLists) {\n    const li = generateImageLi(imageUrl);\n    $(\".msgWindow\").append(li);\n  }\n}\n\nfunction generateImageLi(imageUrl) {\n  return `<li>\n            <div class=\"avatar\">\n              幫手\n            </div>\n            <div class=\"msgBubble\">\n              <div class=\"bubble\">\n                <img src=\"${imageUrl}\" alt=\"\">\n              </div>\n            </div>\n          </li>`;\n}\n\nfunction newsListBindEvent() {\n  const latestNewsId = \"1585582107822\";\n  const latestSeenNews = localStorage.getItem(\"qazwsx9006Mask\");\n  if (!latestSeenNews || latestSeenNews != latestNewsId)\n    $(\"#newsList .tipLight\").removeClass(\"close\");\n\n  $(\"#newsList\").on(\"click\", function () {\n    $(\"#news\").show();\n    localStorage.setItem(\"qazwsx9006Mask\", latestNewsId);\n    $(\"#newsList .tipLight\").addClass(\"close\");\n  });\n}\n\nfunction bootstrap() {\n  insertImages();\n  newsListBindEvent();\n}\n\nmodule.exports = bootstrap();\n\n\n//# sourceURL=webpack:///./src/javascripts/news.js?");

/***/ }),

/***/ "./src/javascripts/store.js":
/*!**********************************!*\
  !*** ./src/javascripts/store.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const apiUrl = \"https://socketio.weishianglian.com/v2/masks\";\n\nfunction getStores(params) {\n  const { location, storeId } = params;\n  let { distance = 1 } = params;\n  if (distance > 5) distance = 5;\n  console.log({ lat: location.lat, lng: location.lng, distance });\n\n  return $.get(\n    apiUrl,\n    { lat: location.lat, lng: location.lng, distance },\n    (data) => data\n  );\n}\n\nmodule.exports = {\n  getStores,\n};\n\n\n//# sourceURL=webpack:///./src/javascripts/store.js?");

/***/ })

/******/ });