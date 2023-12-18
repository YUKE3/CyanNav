import L from "leaflet";
import { interpolateRgb } from "d3-interpolate";
import HeatmapOverlay from "../leaflet-heatmap.js";
import * as turf from "@turf/turf";
import { useRef, useEffect, useState, useContext } from "react";
import { GlobalStoreContext } from "../store";

function NavJSON({ data, center, zoom }) {
    const { store } = useContext(GlobalStoreContext);
    const geolayer = useRef(null);
    const heatmap = useRef(null);
    const map = useRef(null);

    const onEachFeature = (country, layer) => {
        const name1 = country.fields && country.fields.name;
        const name2 = country.properties && country.properties.admin;
        const name3 = country.properties && country.properties.NAME_0;

        const name = name1 || name2 || name3 || "";

        layer.bindPopup(name);

        // Possible map templates : 'heatmap', 'distributiveflowmap', 'pointmap', 'choroplethmap', '3drectangle'

        // Calculate the range of value
        const { min, max } = findMinMax(data);

        // Logic for color picking (choropleth)
        const choroColor =
            store.byFeature == null
                ? "#007dff"
                : getColor(country.fields[store.byFeature], min, max);
        const color =
            store.currentMap.mapType == "choroplethmap"
                ? choroColor
                : "#007dff";

        // Set the style for every map
        layer.setStyle({
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: store.currentMap.mapType == "heatmap" ? 0 : 0.7,
        });

        // Set the calculated color only when choropleth else its white
        if (store.currentMap.mapType == "choroplethmap") {
            layer.setStyle({
                fillColor: color,
            });
        }
        // Control the styling when selecting a certain feature(area)
        layer.on({
            click: toggleSelection,
        });
    };

    const toggleSelection = (e) => {
        const layer = e.target;
        const isLayerSelected = layer.options.weight === 2;

        let layerIndex = -1;
        let currentIndex = 0;

        geolayer.current.eachLayer((otherLayer) => {
            if (otherLayer._bounds.equals(layer._bounds)) {
                layerIndex = currentIndex;
            }
            currentIndex++;
        });

        geolayer.current.eachLayer((otherLayer) => {
            if (otherLayer !== layer) {
                otherLayer.setStyle({
                    weight: 2,
                    opacity: 1,
                    color: "white",
                    dashArray: "3",
                    fillOpacity:
                        store.currentMap.mapType == "heatmap" ? 0 : 0.7,
                });
            }
        });

        if (!isLayerSelected) {
            // Revert to original style
            layer.setStyle({
                weight: 2,
                opacity: 1,
                color: "white",
                dashArray: "3",
                fillOpacity: store.currentMap.mapType == "heatmap" ? 0 : 0.7,
            });
            store.setCurrentArea(-1);
            return null;
        } else {
            // Set the selected style
            layer.setStyle({
                weight: 5,
                color: "#666",
                dashArray: "",
                fillOpacity: store.currentMap.mapType == "heatmap" ? 0 : 0.7,
            });
            layer.bringToFront();
            store.setCurrentArea(layerIndex);
        }
    };

    const getColor = (d, min, max, color1 = "#FFEDA0", color2 = "#800026") => {
        const percentage = (parseInt(d, 10) - min) / (max - min);
        return interpolateRgb(color1, color2)(percentage);
    };

    const findMinMax = (data) => {
        let min = 0;
        let max = Number.MIN_VALUE;

        if (store.byFeature == null) {
            return { min, max };
        }

        data.features.forEach((feature) => {
            const value = parseInt(feature.fields[store.byFeature], 10);
            if (value !== undefined && !isNaN(value)) {
                if (value < min) {
                    min = value;
                }
                if (value > max) {
                    max = value;
                }
            }
        });

        return { min, max };
    };

    // Called in Choropleth Map Only
    const setupGeoJSONLayer = (geoData) => {
        if (map.current && geolayer.current) {
            // Remove the existing GeoJSON layer
            geolayer.current.clearLayers();

            // Create and add the new GeoJSON layer
            const newGeo = L.geoJson(geoData, {
                onEachFeature: onEachFeature,
            }).addTo(map.current);

            // Update the geolayer ref
            geolayer.current = newGeo;
        }
    };

    const setupHeatMapLayer = () => {
        //preliminary checking
        const radius = Number(store.geojson.features[0]?.fields?.radius);
        if (isNaN(radius)) {
            return;
        }
        const cfg = {
            radius: radius,
            maxOpacity: 0.8,
            scaleRadius: true,
            useLocalExtrema: true,
            latField: "lat",
            lngField: "lng",
            valueField: "count",
        };

        if (map.current && heatmap.current) {
            map.current.removeLayer(heatmap.current);
        }

        // Create and add the HeatmapOverlay
        const heatmapLayer = new HeatmapOverlay(cfg).addTo(map.current);
        heatmap.current = heatmapLayer;
        // Extract heatmap data from store.geojson
        const heatmapLayerData = store.geojson.features.reduce(
            (acc, feature) => {
                const center = turf.centerOfMass(feature);

                // Check if the intensity value is available and not NaN
                const intensity =
                    feature.fields && feature.fields[store.byFeature]
                        ? parseInt(feature.fields[store.byFeature], 10)
                        : NaN;

                // Only push if intensity is a valid number
                if (!isNaN(intensity)) {
                    acc.push({
                        lat: center.geometry.coordinates[1],
                        lng: center.geometry.coordinates[0],
                        count: intensity,
                    });
                }
                return acc;
            },
            []
        );

        heatmapLayer.setData({ data: heatmapLayerData });
        // heatmapLayer._el.style.zIndex = 700;
    };

    const setupPointMapLayer = () => {
        //preliminary checking
        const radius = Number(store.geojson.features[0]?.fields?.radius);
        if (isNaN(radius)) {
            return;
        }

        if (map.current) {
            // Remove existing circles if any
            map.current.eachLayer((layer) => {
                if (layer instanceof L.Circle) {
                    map.current.removeLayer(layer);
                }
            });
        }

        // Extract circle data from store.geojson
        store.geojson.features.forEach((feature) => {
            const center = turf.centerOfMass(feature);

            const count =
                feature.fields &&
                (feature.fields[store.byFeature]
                    ? parseInt(feature.fields[store.byFeature], 10)
                    : NaN);

            // Only proceed if count is a valid number
            if (!isNaN(count)) {
                // Create and add circle marker
                const circle = L.circle(
                    [
                        center.geometry.coordinates[1],
                        center.geometry.coordinates[0],
                    ],
                    {
                        radius: count * radius, // Adjust the radius based on the count
                        fillColor: "gray", // Customize the fill color
                        fillOpacity: 0.8,
                        color: "black",
                        weight: 1,
                    }
                ).addTo(map.current);
                circle.bringToFront();

                // You can add additional customization for the circles if needed
            }
        });
    };

    const setup3D = () => {
        // Preliminary checking
        const scale = Number(store.geojson.features[0]?.fields?.scale);
        if (isNaN(scale)) {
            return;
        }

        if (map.current) {
            // Remove existing icon markers if any
            map.current.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    map.current.removeLayer(layer);
                }
            });
        }

        // Extract cube data from store.geojson
        store.geojson.features.forEach((feature) => {
            const center = turf.centerOfMass(feature);

            // Check if the count value is available and not NaN
            const count =
                feature.fields &&
                (feature.fields[store.byFeature]
                    ? parseInt(feature.fields[store.byFeature], 10)
                    : NaN);

            // Only proceed if count is a valid number
            if (!isNaN(count)) {
                // Create and add cube marker

                console.log("count", count, feature.fields);
                const cubeSize = 50; // Adjust the size as needed
                const marker = L.marker(
                    [
                        center.geometry.coordinates[1],
                        center.geometry.coordinates[0],
                    ],
                    {
                        icon: createCubeIcon(cubeSize, count),
                    }
                ).addTo(map.current);
            }
        });
    };

    const setupDFM = () => {
        // Preliminary checking
        const weight = Number(store.geojson.features[0]?.fields?.weight);
        if (isNaN(weight)) {
            return;
        }

        if (map.current) {
            // Remove existing icon markers if any
            map.current.eachLayer((layer) => {
                if (layer instanceof L.Polyline) {
                    map.current.removeLayer(layer);
                }
            });
        }

        // Extract cube data from store.geojson
        store.geojson.features.forEach((feature) => {
            const center = [
                feature.fields.center_longitude,
                feature.fields.center_latitude,
            ];

            feature.fields.lines.forEach((lines) => {
                [country_index, line_weight] = lines;
                const target_country =
                    store.geojson.features[country_index].fields;
                const target_center = [
                    target_country.center_longitude,
                    target_country.center_latitude,
                ];

                const count = line_weight ? parseInt(line_weight, 10) : NaN;

                let polyline = L.polyline([center, target_center], {
                    color: "red",
                    weight: count,
                    opacity: 0.5,
                    smoothFactor: 1,
                }).addTo(map);
            });

            // Check if the count value is available and not NaN
            // const count =
            //   feature.fields &&
            //   (feature.fields[store.byFeature]
            //     ? parseInt(feature.fields[store.byFeature], 10)
            //     : NaN);

            // Only proceed if count is a valid number
            if (!isNaN(count)) {
                // Create and add cube marker

                console.log("count", count, feature.fields);
                const cubeSize = 50; // Adjust the size as needed
                const marker = L.marker(
                    [
                        center.geometry.coordinates[1],
                        center.geometry.coordinates[0],
                    ],
                    {
                        icon: createCubeIcon(cubeSize, count),
                    }
                ).addTo(map.current);
            }
        });
    };

    function createCubeIcon(cubeSize, numCubes) {
        let iconHtml = "<div class='container'>";

        for (let i = 0; i < numCubes; i++) {
            // Calculate the offset for the right face

            // Add inline styles for each left and right face

            iconHtml += `
        <div class='left' style="transform: translateY(-${
            i * 100
        }%) rotate(90deg) skewX(-30deg) scaleY(0.864);"></div>
        <div class='right' style="transform: translateY(-${
            i * 100
        }%) rotate(-30deg) skewX(-30deg) scaleY(0.864);"></div>
      `;
        }

        // Add the common top face
        iconHtml +=
            "<div class='top' style='bottom: " + numCubes * 200 + "%'></div>";
        iconHtml += "</div>";

        return L.divIcon({
            className: "custom-icon",
            html: iconHtml,
            iconSize: [cubeSize, cubeSize],
            iconAnchor: [0, cubeSize * numCubes],
        });
    }

    useEffect(() => {
        // Initialize the Leaflet map and store its reference in the map ref
        const mapInstance = L.map("map").setView([0, 0], 2);
        map.current = mapInstance;

        // Create and add the tile layer
        const OpenStreetMap_DE = L.tileLayer(
            "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
            {
                maxZoom: 18,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }
        ).addTo(mapInstance);

        // Create and add the GeoJSON layer
        const geo = L.geoJson(data, {
            onEachFeature: onEachFeature,
        }).addTo(mapInstance);

        geolayer.current = geo;

        if (map.current && map.current.getBoundsZoom && geolayer.current) {
            // Set the view of the map to fit the GeoJSON bounds
            const geoBounds = geolayer.current.getBounds();
            map.current.setView(
                geoBounds.getCenter(),

                map.current.getBoundsZoom(geoBounds) + 1
            );
        }

        // Cleanup function to remove the map and associated layers when the component is unmounted
        return () => {
            mapInstance.remove();
        };
    }, []);

    // Use another useEffect to set the view after the initial render
    useEffect(() => {
        setupGeoJSONLayer(data);
        // Possible map templates: 'heatmap', 'distributiveflowmap', 'pointmap', 'choroplethmap', '3drectangle'
        if (store.currentMap.mapType === "heatmap") {
            setupHeatMapLayer();
        } else if (store.currentMap.mapType === "pointmap") {
            setupPointMapLayer();
        } else if (store.currentMap.mapType === "distributiveflowmap") {
            setupDFM();
        } else if (store.currentMap.mapType === "3drectangle") {
            setup3D();
        }
    }, [data]);

    useEffect(() => {
        setupGeoJSONLayer(data);
        if (map.current && map.current.getBoundsZoom && geolayer.current) {
            // Set the view of the map to fit the GeoJSON bounds
            const geoBounds = geolayer.current.getBounds();
            map.current.setView(
                geoBounds.getCenter(),
                map.current.getBoundsZoom(geoBounds) + 1
            );
        }
    }, [store.currentMap]);

    return <div id="map" style={{ height: "100vh" }}></div>;
}

export default NavJSON;
