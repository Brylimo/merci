$(() => {
    let idleTime = 0;
    const idleTimeout = 300;
    const infraZoomThreshold = 15.9;
    const sttnZoomThreshold = 16.5;

    // create map
    const map = new ol.Map({
       target: 'vMap',
       layers: [
           new ol.layer.Tile({
               source: new ol.source.OSM()  // use OSM tile
           })
       ],
       view: new ol.View({
           center: ol.proj.fromLonLat([125.3, 36.5]),
           zoom: 7
       })
    });

    // register map
    GeoLayer.setMap(map);
    executeRealTimeLocation();

    $(document).on('wheel click', () => {
        const zoom = map.getView().getZoom();

        if (zoom < infraZoomThreshold) {
            GeoLayer.removeLayer("layer_name", "infra_point_marker");
            GeoLayer.removeAllOverlays("infra");
            GeoLayer.fetchedInfraList = [];
        }

        if (zoom < sttnZoomThreshold) {
            GeoLayer.removeLayer("layer_name", "sttn_point_marker");
            GeoLayer.fetchedSttnList = [];
        }

        GeoLayer.infraFlag = false;
        GeoLayer.sttnFlag = false;
        idleTime = 0;
    });

    // bottom alert event handling
    $(".bottom-alert .yes").on("click", () => {
        $(".modal").removeClass("modal-none");
        $(".modal").addClass("modal-show");
    });

    $(".bottom-alert .no").on("click", () => {
        GeoLayer.removeLayer("layer_name", "pin_red_marker")
        $(".bottom-alert").hide();
    });

    // search-location event handling
    $(".search-location-btn").on("click", () => {
       const search = $("#search-location").val();

        $.ajax({
            url: "/api/geo/cvtquerytocoord.json",
            type: "GET",
            data: {
                query: search
            },
            success: (res) => {
                res.forEach((item) => {
                    GeoLayer.pinBlueMarker(item.x, item.y);
                })
            },
            error: (error) => {
                alert("위치 찾기에 실패했습니다.\n해당 문제가 지속될 경우 관리자에게 문의하여 주십시요.");
                console.error(error.code);
            }
        });
    });

    // map event handling
    map.on("click", (event) => {
        const pixel = event.pixel;

        GeoLayer.removeAllOverlays("infra");
        map.forEachFeatureAtPixel(pixel, (feature, layer) => {

            if (layer.get("layer_name") === "infra_point_marker") {
                const infraData = feature.get("data");
                const infraOverlay = GeoLayer.createOverlay(new OverlayInfo("infra", infraData));

                if (infraOverlay) {
                    const result = new ol.Overlay({
                       id: infraData.id,
                       element: infraOverlay,
                       offset: [0, -70],
                       position: ol.proj.transform([infraData.x, infraData.y], 'EPSG:4326', "EPSG:900913")
                    });

                    GeoLayer.removeOverlay(map.getOverlayById(infraData.id));
                    GeoLayer.addOverlay(result);
                }
            }

        });

        if (GeoLayer.manualFlag) {  // manual location register
            GeoLayer.removeLayer("layer_name", "pin_red_marker")

            const coordinate = ol.proj.transform(map.getCoordinateFromPixel(pixel), 'EPSG:3857', 'EPSG:4326');

            const lon = coordinate[0];
            const lat = coordinate[1];

            // draw marker
            GeoLayer.pinRedMarker(lon, lat);

            $.ajax({
                url: "/api/geo/cvtcoordtoaddr.json",
                type: "GET",
                data: {
                    lon: lon,
                    lat: lat
                },
                success: (res) => {
                    $(".bottom-alert").show();
                    $(".bottom-alert > .place > p").text(res["address_name"]);
                    $(".modal input[name='spotLon']").val(lon);
                    $(".modal input[name='spotLat']").val(lat);
                    $(".modal #spotLoc").val(res["address_name"]);
                },
                error: (error) => {
                    alert("위치 찾기에 실패했습니다.\n해당 문제가 지속될 경우 관리자에게 문의하여 주십시요.");
                    console.error(error.code);
                }
            });
        }
    });

    // idle detecting timer
    setInterval(() => {
        idleTime += 100;

        const zoom = map.getView().getZoom();

        // meaningful idle time for infra
        if (!GeoLayer.infraFlag && zoom >= infraZoomThreshold && idleTime >= idleTimeout) {

            GeoLayer.infraFlag = true;

            const [ minLon, minLat, maxLon, maxLat ] = map.getView().calculateExtent();

            const centerLon = (minLon + maxLon) / 2;
            const centerLat = (minLat + maxLat) / 2;

            const radius = GeoLayer.getDistance(minLat, minLon, centerLat, centerLon);
            const coordinate = ol.proj.transform([centerLon, centerLat], 'EPSG:3857', 'EPSG:4326');

            // infra
            $.ajax({
                url: "/api/geo/fetchInfra.json",
                type: "GET",
                data: {
                    lon: coordinate[0],
                    lat: coordinate[1],
                    rad: radius
                },
                success: (res) => {

                    let returnArr = [];

                    const diff = res.filter(obj => !GeoLayer.fetchedInfraList.includes(obj.id));

                    diff.forEach(infra => {
                        returnArr.push(infra.id);
                        GeoLayer.pinInfraPoint(infra, infra.x, infra.y);
                    });

                    GeoLayer.fetchedInfraList.push(...returnArr);

                },
                error: (error) => {
                    console.error(error.code);
                }
            });
        }

        // meaningful idle time for station
        if (!GeoLayer.sttnFlag && zoom >= sttnZoomThreshold && idleTime >= idleTimeout) {
            GeoLayer.sttnFlag = true;

            const [ minLon, minLat, maxLon, maxLat ] = map.getView().calculateExtent();

            const centerLon = (minLon + maxLon) / 2;
            const centerLat = (minLat + maxLat) / 2;
            const coordinate = ol.proj.transform([centerLon, centerLat], 'EPSG:3857', 'EPSG:4326');

            // station
            $.ajax({
                url: "/api/geo/fetchSttnList.json",
                type: "GET",
                data: {
                    lon: coordinate[0],
                    lat: coordinate[1]
                },
                success: (res) => {
                    let returnArr = [];

                    const diff = res.filter(obj => !GeoLayer.fetchedSttnList.includes(obj["nodeid"]));

                    diff.forEach(sttn => {
                        returnArr.push(sttn["nodeid"]);
                        GeoLayer.pinSttnPoint(sttn, sttn["gpslong"], sttn["gpslati"]);
                    });

                    GeoLayer.fetchedSttnList.push(...returnArr);

                },
                error: (error) => {
                    console.error(error.code);
                }
            });
        }

    }, 100);
});

const layerCheckHandler = (target) => {
    if (target === "MANUAL") {
        if ($("#chk"+target).is(':checked')) {
            GeoLayer.manualFlag = true;
        } else {
            $(".bottom-alert").hide();
            GeoLayer.manualFlag = false;
            GeoLayer.removeLayer("layer_name", "pin_red_marker");
        }
    } else if (target === "CURRENT") {
        if ($("#chk"+target).is(':checked')) {
            const lon = GeoLayer.currentCoords.lon;
            const lat = GeoLayer.currentCoords.lat;

            if (lon && lat) {
                $.ajax({
                    url: "/api/geo/cvtcoordtoaddr.json",
                    type: "GET",
                    data: {
                        lon: lon,
                        lat: lat
                    },
                    success: (res) => {
                        $(".modal input[name='spotLon']").val(lon);
                        $(".modal input[name='spotLat']").val(lat);
                        $(".modal #spotLoc").val(res["address_name"]);

                        $(".modal").removeClass("modal-none");
                        $(".modal").addClass("modal-show");
                    },
                    error: (error) => {
                        alert("위치 찾기에 실패했습니다.\n해당 문제가 지속될 경우 관리자에게 문의하여 주십시요.");
                        console.error(error.code);
                    }
                });
            } else {
                alert("현재 위치를 등록할 수 없습니다.");
            }

        } else {

        }
    }
}

const watchPositionHandler = (rtData) => {
    const { coords } = rtData;

    GeoLayer.currentCoords.lon = coords.longitude;
    GeoLayer.currentCoords.lat = coords.latitude;

    GeoLayer.removeLayer("layer_name", "current_point_marker");
    GeoLayer.pinCurrentPoint(coords.longitude, coords.latitude);
}

const executeRealTimeLocation = () => {
    if (!navigator.geolocation) {
        console.log("실시간 위치 정보가 지원되지 않습니다.");
    }
    navigator.geolocation.watchPosition(watchPositionHandler);
}