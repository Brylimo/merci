class GeoLayer {
    static map = null;
    static manualFlag = false;
    static infraFlag = false;
    static sttnFlag = false;
    static fetchedInfraList = [];
    static fetchedSttnList = [];

    static currentCoords = {
        lon: null,
        lat: null
    }

    static InfraType = {
        MT1: {
            name: "대형마트",
            color: "red"
        },
        CS2: {
            name: "편의점",
            color: "orange"
        },
        PS3: {
            name: "어린이집, 유치원",
            color: "yellow"
        },
        SC4: {
            name: "학교",
            color: "green"
        },
        AC5: {
            name: "학원",
            color: "blue"
        },
        PK6: {
            name: "주차장",
            color: "indigo"
        },
        OL7: {
            name: "주유소, 충전소",
            color: "purple"
        },
        SW8: {
            name: "지하철역",
            color: "pink"
        },
        BK9: {
            name: "은행",
            color: "teal"
        },
        CT1: {
            name: "문화시설",
            color: "black"
        },
        AG2: {
            name: "중개업소",
            color: "brown"
        },
        PO3: {
            name: "공공기관",
            color: "grey"
        },
        AT4: {
            name: "관광명소",
            color: "aqua"
        },
        AD5: {
            name: "숙박",
            color: "aquamarine"
        },
        FD6: {
            name: "음식점",
            color: "chartreuse"
        },
        CE7: {
            name: "카페",
            color: "darkgreen"
        },
        HP8: {
            name: "병원",
            color: "darkolivegreen"
        },
        PM9: {
            name: "약국",
            color: "firebrick"
        }
    }

    // function sets map
    static setMap(map) {
        this.map = map;
    }

    // function add overlay
    static addOverlay(overlay) {
        this.map.addOverlay(overlay);
    }

    // function remove overlay
    static removeOverlay(overlay) {
        this.map.removeOverlay(overlay);
    }

    // function remove layer
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

    // function returns distance between two points
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

    // function pins red marker
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

        markerRedLayer.set("layer_name", "pin_red_marker");

        this.map.addLayer(markerRedLayer);
    }

    // function pins blue marker
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

        markerBlueLayer.set("layer_name", "pin_blue_marker");

        this.map.addLayer(markerBlueLayer);
    }

    // function pins current point
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

        currentPointLayer.set("layer_name", "current_point_marker");

        this.map.addLayer(currentPointLayer);
    }

    // function pins infra point
    static pinInfraPoint(infra, lon, lat) {
        const feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', "EPSG:900913")),
            data: infra
        });

        const infraPointStyle = new ol.style.Style({
            image: new ol.style.Circle(({
                radius: 3,
                stroke: new ol.style.Stroke({
                    color: "black"
                }),
                fill: new ol.style.Fill({
                    color: this.InfraType[infra["category_group_code"]].color
                })
            }))
        });
        feature.setStyle(infraPointStyle);

        const infraPointVSource = new ol.source.Vector({
            features: [feature]
        });

        const infraPointLayer = new ol.layer.Vector({
            source: infraPointVSource
        });

        infraPointLayer.set("layer_name", "infra_point_marker");

        this.map.addLayer(infraPointLayer);
    }

    // function pins station point
    static pinSttnPoint(sttn, lon, lat) {
        const feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', "EPSG:900913")),
            data: sttn
        });

        const sttnPointStyle = new ol.style.Style({
            image: new ol.style.Circle(({
                radius: 3,
                stroke: new ol.style.Stroke({
                    color: "black"
                }),
                fill: new ol.style.Fill({
                    color: "white"
                })
            }))
        });
        feature.setStyle(sttnPointStyle);

        const sttnPointVSource = new ol.source.Vector({
            features: [feature]
        });

        const sttnPointLayer = new ol.layer.Vector({
            source: sttnPointVSource
        });

        sttnPointLayer.set("layer_name", "sttn_point_marker");

        this.map.addLayer(sttnPointLayer);
    }

    // function creates overlay element
    static createOverlay(overlayInfo) {
        if (overlayInfo instanceof OverlayInfo) {
            let overlay = document.createElement("div");

            overlay.setAttribute("class", "overlay-element");
            overlay.setAttribute("style", "background-color: #ffffff; padding: 1rem 2rem");
            overlay.setAttribute("data-id", overlayInfo.data.id);
            overlay.setAttribute("data-type", overlayInfo.type);

            const bodyHTML = $(".overlay-wrapper").html();
            const headerHTML = $(`.${overlayInfo.type}-overlay-header-wrapper`).html();
            const contentHTML = $(`.${overlayInfo.type}-overlay-content-wrapper`).html();

            let header = $(headerHTML);
            let body = $(bodyHTML);
            let content = $(contentHTML);

            if (overlayInfo.type === "infra") { // infra type overlay
                // overlay header info
                header.find(".infra-overlay-title").text(overlayInfo.data["place_name"]);
                header.find(".infra-overlay-category").text(overlayInfo.data["category_group_name"]);

                // overlay content info
                content.find(".infra-overlay-address").text(overlayInfo.data["road_address_name"]);
                content.find(".infra-overlay-phone").text(overlayInfo.data["phone"]);
            }

            body.append(header);
            body.append(content);

            $(overlay).append(body);

            return overlay;
        }
        return null;
    }

    // function removes all same type overlays
    static removeAllOverlays(type) {
        let array = [];
        const overlays = document.querySelectorAll(".overlay-element");

        overlays.forEach(overlay => {
            if (overlay.dataset.type === type) {
                array.push(overlay);
            }
        })

        while (array.length) {
            let poppedOverlay = array.pop();
            this.removeOverlay(this.map.getOverlayById(poppedOverlay.dataset.id));
        }
    }
}