document.write('<script src="/js/gis/GisLayer.js">');

var map;
var view;

$(() => {
    var map = new ol.Map({
       target: 'vMap',
       layers: [
           new ol.layer.Tile({
               source: new ol.source.OSM()
           })
       ],
       view: new ol.View({
           center: ol.proj.fromLonLat([127, 36]),
           zoom: 7
       })
    });


});