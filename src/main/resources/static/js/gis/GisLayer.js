const GisLayer = {
    map: null,
    setMap: map => {
        GisLayer.map = map;
    },
    removeLayer: (source, target) => {
        let array = [];

        GisLayer.map.getLayers().forEach((layer) => {
            if (layer.get(source) == target) {
                array.push(layer);
            }
        });

        while (array.length) {
            const lastElement = array.pop();
            GisLayer.map.removeLayer(lastElement);
        }
    },
    pinMarker: (lon, lat) => {
        let feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', "EPSG:900913"))
        });

        const iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [10, 10],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: '/images/marker/marker_red.png'
            }))
        });
        feature.setStyle(iconStyle);

        const markerSource = new ol.source.Vector({
            features: [feature]
        });

        const markerLayer = new ol.layer.Vector({
            source: markerSource
        });

        markerLayer.set("temp", "temp_marker");

        GisLayer.map.addLayer(markerLayer);
    }
}