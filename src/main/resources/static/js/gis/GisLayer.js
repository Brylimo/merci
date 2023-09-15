class GisLayer {
    static map = null;
    static manualFlag = false;
    static currentCoords = {
        lon: null,
        lat: null
    }

    static setMap(map) {
        this.map = map;
    }

    static removeLayer(source, target) {
        let array = [];

        this.map.getLayers().forEach((layer) => {
            if (layer.get(source) == target) {
                array.push(layer);
            }
        });

        while (array.length) {
            const lastElement = array.pop();
            this.map.removeLayer(lastElement);
        }
    }

    static pinRedMarker(lon, lat) {
        const feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', "EPSG:900913"))
        });

        const iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [10, 10],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: '/img/marker/marker_red.png'
            }))
        });
        feature.setStyle(iconStyle);

        const markerRedSource = new ol.source.Vector({
            features: [feature]
        });

        const markerRedLayer = new ol.layer.Vector({
            source: markerRedSource
        });

        markerRedLayer.set("red_pin", "pin_red_marker");

        this.map.addLayer(markerRedLayer);
    }

    static pinBlueMarker(lon, lat) {
        const feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', "EPSG:900913"))
        });

        const iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [10, 10],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: '/img/marker/marker_blue.png'
            }))
        });
        feature.setStyle(iconStyle);

        const markerBlueSource = new ol.source.Vector({
            features: [feature]
        });

        const markerBlueLayer = new ol.layer.Vector({
            source: markerBlueSource
        });

        markerBlueLayer.set("blue_pin", "pin_blue_marker");

        this.map.addLayer(markerBlueLayer);
    }

    static pinCurrentPoint(lon, lat) {
        const feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', "EPSG:900913"))
        });

        const currentPointStyle = new ol.style.Style({
            image: new ol.style.Circle(({
                radius: 3,
                stroke: new ol.style.Stroke({
                    color: "deeppink"
                }),
                fill: new ol.style.Fill({
                    color: "deeppink"
                })
            }))
        });
        feature.setStyle(currentPointStyle);

        const currentPointVSource = new ol.source.Vector({
            features: [feature]
        });

        const currentPointLayer = new ol.layer.Vector({
            source: currentPointVSource
        });

        currentPointLayer.set("current_point", "current_point_marker");

        this.map.addLayer(currentPointLayer);
    }
}