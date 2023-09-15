class GisLayer {
    static map = null;
    static manualFlag = false;

    static setMap(map) {
        this.map = map;
    }

    static layerCheckHandler(target) {
        if (target === "MANUAL") {
            if ($("#chk"+target).is(':checked')) {
                this.manualFlag = true;
            } else {
                $(".bottom-alert").hide();
                this.manualFlag = false;
                this.removeLayer("pin", "pin_marker")
            }
        }
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

    static pinMarker(lon, lat) {
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

        const markerSource = new ol.source.Vector({
            features: [feature]
        });

        const markerLayer = new ol.layer.Vector({
            source: markerSource
        });

        markerLayer.set("pin", "pin_marker");

        this.map.addLayer(markerLayer);
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