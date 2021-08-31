const geolib = require('geolib');

module.exports = function getCenterAmongCoords(njuskaloDataByUrl) {
    const getCenterArg = njuskaloDataByUrl
        .filter(({ map }) => map?.mapData?.defaultMarker !== undefined)
        .map(({ map: { mapData: { defaultMarker } } }) => {
            return { latitude: defaultMarker.lat, longitude: defaultMarker.lng };
        });

    return geolib.getCenter(getCenterArg);
}