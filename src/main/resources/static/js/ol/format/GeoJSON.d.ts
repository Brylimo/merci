export default GeoJSON;
export type GeoJSONObject = import("static/js/v7.5.1-package/format/GeoJSON").GeoJSON;
export type GeoJSONFeature = import("static/js/v7.5.1-package/format/GeoJSON").Feature;
export type GeoJSONFeatureCollection = import("static/js/v7.5.1-package/format/GeoJSON").FeatureCollection;
export type GeoJSONGeometry = import("static/js/v7.5.1-package/format/GeoJSON").Geometry;
export type GeoJSONPoint = import("static/js/v7.5.1-package/format/GeoJSON").Point;
export type GeoJSONLineString = import("static/js/v7.5.1-package/format/GeoJSON").LineString;
export type GeoJSONPolygon = import("static/js/v7.5.1-package/format/GeoJSON").Polygon;
export type GeoJSONMultiPoint = import("static/js/v7.5.1-package/format/GeoJSON").MultiPoint;
export type GeoJSONMultiLineString = import("static/js/v7.5.1-package/format/GeoJSON").MultiLineString;
export type GeoJSONMultiPolygon = import("static/js/v7.5.1-package/format/GeoJSON").MultiPolygon;
export type GeoJSONGeometryCollection = import("static/js/v7.5.1-package/format/GeoJSON").GeometryCollection;
export type Options = {
    /**
     * Default data projection.
     */
    dataProjection?: import("../proj.js").ProjectionLike;
    /**
     * Projection for features read or
     * written by the format.  Options passed to read or write methods will take precedence.
     */
    featureProjection?: import("../proj.js").ProjectionLike;
    /**
     * Geometry name to use when creating features.
     */
    geometryName?: string | undefined;
    /**
     * Certain GeoJSON providers include
     * the geometry_name field in the feature GeoJSON. If set to `true` the GeoJSON reader
     * will look for that field to set the geometry name. If both this field is set to `true`
     * and a `geometryName` is provided, the `geometryName` will take precedence.
     */
    extractGeometryName?: boolean | undefined;
};
/**
 * @typedef {import("static/js/v7.5.1-package/format/GeoJSON").GeoJSON} GeoJSONObject
 * @typedef {import("static/js/v7.5.1-package/format/GeoJSON").Feature} GeoJSONFeature
 * @typedef {import("static/js/v7.5.1-package/format/GeoJSON").FeatureCollection} GeoJSONFeatureCollection
 * @typedef {import("static/js/v7.5.1-package/format/GeoJSON").Geometry} GeoJSONGeometry
 * @typedef {import("static/js/v7.5.1-package/format/GeoJSON").Point} GeoJSONPoint
 * @typedef {import("static/js/v7.5.1-package/format/GeoJSON").LineString} GeoJSONLineString
 * @typedef {import("static/js/v7.5.1-package/format/GeoJSON").Polygon} GeoJSONPolygon
 * @typedef {import("static/js/v7.5.1-package/format/GeoJSON").MultiPoint} GeoJSONMultiPoint
 * @typedef {import("static/js/v7.5.1-package/format/GeoJSON").MultiLineString} GeoJSONMultiLineString
 * @typedef {import("static/js/v7.5.1-package/format/GeoJSON").MultiPolygon} GeoJSONMultiPolygon
 * @typedef {import("static/js/v7.5.1-package/format/GeoJSON").GeometryCollection} GeoJSONGeometryCollection
 */
/**
 * @typedef {Object} Options
 * @property {import("../proj.js").ProjectionLike} [dataProjection='EPSG:4326'] Default data projection.
 * @property {import("../proj.js").ProjectionLike} [featureProjection] Projection for features read or
 * written by the format.  Options passed to read or write methods will take precedence.
 * @property {string} [geometryName] Geometry name to use when creating features.
 * @property {boolean} [extractGeometryName=false] Certain GeoJSON providers include
 * the geometry_name field in the feature GeoJSON. If set to `true` the GeoJSON reader
 * will look for that field to set the geometry name. If both this field is set to `true`
 * and a `geometryName` is provided, the `geometryName` will take precedence.
 */
/**
 * @classdesc
 * Feature format for reading and writing data in the GeoJSON format.
 *
 * @api
 */
declare class GeoJSON extends JSONFeature {
    /**
     * @param {Options} [options] Options.
     */
    constructor(options?: Options | undefined);
    /**
     * Name of the geometry attribute for features.
     * @type {string|undefined}
     * @private
     */
    private geometryName_;
    /**
     * Look for the geometry name in the feature GeoJSON
     * @type {boolean|undefined}
     * @private
     */
    private extractGeometryName_;
    /**
     * @param {GeoJSONGeometry} object Object.
     * @param {import("./Feature.js").ReadOptions} [options] Read options.
     * @protected
     * @return {import("../geom/Geometry.js").default} Geometry.
     */
    protected readGeometryFromObject(object: GeoJSONGeometry, options?: import("./Feature.js").ReadOptions | undefined): import("../geom/Geometry.js").default;
    /**
     * Encode a feature as a GeoJSON Feature object.
     *
     * @param {import("../Feature.js").default} feature Feature.
     * @param {import("./Feature.js").WriteOptions} [options] Write options.
     * @return {GeoJSONFeature} Object.
     * @api
     */
    writeFeatureObject(feature: import("../Feature.js").default, options?: import("./Feature.js").WriteOptions | undefined): GeoJSONFeature;
    /**
     * Encode an array of features as a GeoJSON object.
     *
     * @param {Array<import("../Feature.js").default>} features Features.
     * @param {import("./Feature.js").WriteOptions} [options] Write options.
     * @return {GeoJSONFeatureCollection} GeoJSON Object.
     * @api
     */
    writeFeaturesObject(features: Array<import("../Feature.js").default>, options?: import("./Feature.js").WriteOptions | undefined): GeoJSONFeatureCollection;
    /**
     * Encode a geometry as a GeoJSON object.
     *
     * @param {import("../geom/Geometry.js").default} geometry Geometry.
     * @param {import("./Feature.js").WriteOptions} [options] Write options.
     * @return {GeoJSONGeometry|GeoJSONGeometryCollection} Object.
     * @api
     */
    writeGeometryObject(geometry: import("../geom/Geometry.js").default, options?: import("./Feature.js").WriteOptions | undefined): GeoJSONGeometry | GeoJSONGeometryCollection;
}
import JSONFeature from './JSONFeature.js';
//# sourceMappingURL=GeoJSON.d.ts.map