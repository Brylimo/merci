$(() => {
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
    GisLayer.setMap(map);
    executeRealTimeLocation();

    // bottom alert event handling
    $(".bottom-alert .yes").on("click", () => {
        $(".modal").removeClass("modal-none");
        $(".modal").addClass("modal-show");
    });

    $(".bottom-alert .no").on("click", () => {
        GisLayer.removeLayer("pin", "pin_marker")
        $(".bottom-alert").hide();
    });

    // map event handling
    map.on("click", (event) => {
        const pixel = event.pixel;

        if (GisLayer.manualFlag) {  // manual location register
            GisLayer.removeLayer("pin", "pin_marker")

            const coordinate = ol.proj.transform(map.getCoordinateFromPixel(pixel), 'EPSG:3857', 'EPSG:4326');

            const lon = coordinate[0];
            const lat = coordinate[1];

            // draw marker
            GisLayer.pinMarker(lon, lat);

            $.ajax({
                url: "/gis/geo/cvtcoordtoaddr.json",
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
});

const layerCheckHandler = (target) => {
    if (target === "MANUAL") {
        if ($("#chk"+target).is(':checked')) {
            GisLayer.manualFlag = true;
        } else {
            $(".bottom-alert").hide();
            GisLayer.manualFlag = false;
            GisLayer.removeLayer("pin", "pin_marker");
        }
    } else if (target === "CURRENT") {
        if ($("#chk"+target).is(':checked')) {
            const lon = GisLayer.currentCoords.lon;
            const lat = GisLayer.currentCoords.lat;

            if (lon && lat) {
                $.ajax({
                    url: "/gis/geo/cvtcoordtoaddr.json",
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

    GisLayer.currentCoords.lon = coords.longitude;
    GisLayer.currentCoords.lat = coords.latitude;

    GisLayer.pinCurrentPoint(coords.longitude, coords.latitude);
}

const executeRealTimeLocation = () => {
    if (!navigator.geolocation) {
        console.log("실시간 위치 정보가 지원되지 않습니다.");
    }
    navigator.geolocation.watchPosition(watchPositionHandler);
}