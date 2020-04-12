const apiUrl = "https://socketio.weishianglian.com/v2/masks";

function getStores(params) {
  const { location, storeId } = params;
  let { distance = 1 } = params;
  if (distance > 5) distance = 5;
  console.log({ lat: location.lat, lng: location.lng, distance });

  return $.get(
    apiUrl,
    { lat: location.lat, lng: location.lng, distance },
    (data) => data
  );
}

module.exports = {
  getStores,
};
