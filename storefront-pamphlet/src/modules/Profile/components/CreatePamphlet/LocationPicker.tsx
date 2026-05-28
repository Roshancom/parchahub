"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

type LatLng = {
  lat: number;
  lng: number;
};

type GeoSearchShowLocationEvent = {
  location: {
    x: number;
    y: number;
    label?: string;
  };
};

type LocationPickerProps = {
  onLocationSelect: (latlng: LatLng, label?: string) => void;
  location?: LatLng | null;
};

// Fix for default icon issue with webpack
const iconDefault = L.Icon.Default.prototype as {
  _getIconUrl?: unknown;
};
delete iconDefault._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationPicker = ({
  onLocationSelect,
  location,
}: LocationPickerProps) => {
  const [position, setPosition] = useState<LatLng>(
    location || { lat: 51.505, lng: -0.09 },
  );

  useEffect(() => {
    if (location) {
      setPosition(location);
    }
  }, [location]);

  const LocationMarker = () => {
    const map = useMapEvents({
      click: async (e) => {
        const latlng = e.latlng;
        setPosition(latlng);
        map.flyTo(latlng, map.getZoom());

        let label = "";

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`,
          );
          const data = await res.json();

          label =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.display_name ||
            "";
        } catch (err) {
          console.error("Reverse geocoding failed", err);
        }

        onLocationSelect(latlng, label);
      },
    });

    useEffect(() => {
      const provider = new OpenStreetMapProvider();
      const SearchControl = GeoSearchControl as unknown as new (options: {
        provider: OpenStreetMapProvider;
        style: string;
        showMarker: boolean;
        showPopup: boolean;
        autoClose: boolean;
        retainZoomLevel: boolean;
        animateZoom: boolean;
        keepResult: boolean;
      }) => L.Control;

      const searchControl = new SearchControl({
        provider,
        style: "bar",
        showMarker: true,
        showPopup: false,
        autoClose: true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: true,
      });
      map.addControl(searchControl);

      const onShowLocation = (result: GeoSearchShowLocationEvent) => {
        const { x, y, label } = result.location;
        const latlng = { lat: y, lng: x };
        setPosition(latlng);
        onLocationSelect(latlng, label);
      };

      map.on(
        "geosearch/showlocation",
        onShowLocation as unknown as L.LeafletEventHandlerFn,
      );

      return () => {
        map.off(
          "geosearch/showlocation",
          onShowLocation as unknown as L.LeafletEventHandlerFn,
        );
        map.removeControl(searchControl);
      };
    }, [map]);

    return <Marker position={position}></Marker>;
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      className="rounded-2xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default LocationPicker;
