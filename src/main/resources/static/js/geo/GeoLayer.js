class GeoLayer {
    static map = null;
    static manualFlag = false;
    static infraFlag = false;
    static fetchedInfraList = [];

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

    static getDistance(lat1, lon1, lat2, lon2) { // 두 위도 경도 사이의 길이를 구하는 함수
        const earthRadius = 6371;

        const lat1Rad = lat1 * (Math.PI / 180);
        const lon1Rad = lon1 * (Math.PI / 180);
        const lat2Rad = lat2 * (Math.PI / 180);
        const lon2Rad = lon2 * (Math.PI / 180);

        const latDiff = lat2Rad - lat1Rad;
        const lonDiff = lon2Rad - lon1Rad;

        // Haversine
        const a = Math.sin(latDiff / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiff / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = earthRadius * c;

        return distance;
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
                src: '/images/marker/marker_red.png'
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
                src: '/images/marker/marker_blue.png'
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

    static pinTempPoint(lon, lat) {
        const feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', "EPSG:900913")),
        });

        const currentPointStyle = new ol.style.Style({
            image: new ol.style.Circle(({
                radius: 3,
                stroke: new ol.style.Stroke({
                    color: "green"
                }),
                fill: new ol.style.Fill({
                    color: "green"
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

        currentPointLayer.set("temp_point", "temp_point_marker");

        this.map.addLayer(currentPointLayer);
    }
}