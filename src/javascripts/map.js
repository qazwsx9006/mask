module.exports = function initMap(params = {}) {
  const customIcons = {
    blueIcon: new L.Icon({
      iconUrl: "./assets/images/marker-icon-2x-blue.png",
      shadowUrl: "./assets/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
    greyIcon: new L.Icon({
      iconUrl: "./assets/images/marker-icon-2x-grey.png",
      shadowUrl: "./assets/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
    locateIcon: new L.divIcon({
      className: "user-icon",
      html: "<div class='user-icon-marker'></div>",
      iconSize: [30, 30],
    }),
  };

  let map;
  let userMarker;
  let markers = {};

  function createMap(params = {}) {
    const options = {
      ...{
        url:
          "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        zoom: 16,
        maxZoom: 18,
        id: "mapbox/streets-v11",
        center: { lat: 25.0479499, lng: 121.5135961 },
        accessToken: "", // 必填值
      },
      ...params,
    };

    const tiles = L.tileLayer(options.url, {
      attribution: options.attribution,
      maxZoom: options.maxZoom,
      id: options.id,
      accessToken: options.accessToken,
    });
    const { center } = options;
    const latLng = L.latLng(center.lat, center.lng);
    return L.map("map", {
      center: latLng,
      zoom: options.zoom,
      layers: [tiles],
    });
  }

  function setUserLocation({ lat, lng }) {
    if (userMarker) {
      userMarker.setLatLng([lat, lng]);
    } else {
      userMarker = L.marker([lat, lng], {
        icon: customIcons.locateIcon,
      }).addTo(map);
    }
    return userMarker;
  }

  function removeStoreMarkers() {
    for (const storeId of Object.keys(markers)) {
      const marker = markers[storeId];
      if (marker) map.removeLayer(marker);
      markers[storeId] = null;
    }
    return markers;
  }

  function addStoreMarker(params = {}) {
    const { lat, lng, icon, customId } = params;
    const markerIcon = customIcons[icon] || greyIcon;
    const marker = L.marker([lat, lng], {
      icon: markerIcon,
      customId,
    }).addTo(map);
    markers[customId] = marker;
    return marker;
  }

  function getRadius() {
    const mapBoundNorthEast = map.getBounds().getNorthEast();
    // m
    const mapDistance = mapBoundNorthEast.distanceTo(map.getCenter());
    // km
    return mapDistance / 1000;
  }

  map = createMap(params);
  return {
    map,
    markers,
    userMarker,
    setUserLocation,
    removeStoreMarkers,
    addStoreMarker,
    getRadius,
    getCenter: map.getCenter.bind(map),
    panTo: map.panTo.bind(map),
  };
};
