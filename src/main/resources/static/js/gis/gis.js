$(() => {
    const map = new ol.Map({
       target: 'vMap',
       layers: [
           new ol.layer.Tile({
               source: new ol.source.OSM()
           })
       ],
       view: new ol.View({
           center: ol.proj.fromLonLat([125.3, 36.5]),
           zoom: 7
       })
    });

    GisLayer.setMap(map);

    map.on("click", (event) => {
        const pixel = event.pixel;

        if (GisLayer.manualFlag) {
            const coordinate = ol.proj.transform(map.getCoordinateFromPixel(pixel), 'EPSG:3857', 'EPSG:4326');

            // draw marker
            GisLayer.pinMarker(coordinate[0], coordinate[1]);
        }
    });

});