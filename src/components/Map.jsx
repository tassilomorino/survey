import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import "./Map.css";
import React from "react";

export default function Map({ children, className, zoom, dark, atlas }) {
  const position = [0.0236, 37.9062];

  const mapBoxToken =
    "pk.eyJ1IjoiZHJlYW1uZXJkIiwiYSI6ImNrenJkZnoxbzB1M2MzMWxnbTd1OHVmOGUifQ.rIafsHzLmqot_MysT57B3Q";

  const defaultZoom = 6;

  return (
    <div>
      <MapContainer
        className={className || "main"}
        center={position}
        zoom={zoom || defaultZoom}
        scrollWheelZoom={true}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Default layer">
            {atlas && (
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/${
                  dark ? "dark" : "light"
                }-v9/tiles/{z}/{x}/{y}?access_token=${mapBoxToken}`}
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
            )}

            {!atlas && (
              <TileLayer
                url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
            )}
          </LayersControl.BaseLayer>
          {children}
        </LayersControl>
      </MapContainer>
    </div>
  );
}
