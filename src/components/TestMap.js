import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

const TestMap = () => {
  const geoJsonURL = "/Zip_Codes.geojson"; // Update with the correct URL

  return (
    <MapContainer center={[34.192, 108.872]} zoom={10} style={{ width: "500px", height: "500px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"

        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON url={geoJsonURL} />
    </MapContainer>
  );
};

export default TestMap;
