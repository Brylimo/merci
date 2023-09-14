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

    $(".bottom-alert .yes").on("click", () => {
        $(".modal").removeClass("modal-none");
        $(".modal").addClass("modal-show");
    });

    $(".bottom-alert .no").on("click", () => {
        GisLayer.removeLayer("temp", "temp_marker")
        $(".bottom-alert").hide();
    });

    map.on("click", (event) => {
        const pixel = event.pixel;

        if (GisLayer.manualFlag) {
            GisLayer.removeLayer("temp", "temp_marker")

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