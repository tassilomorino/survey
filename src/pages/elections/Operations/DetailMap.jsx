import { useRef, useContext, useEffect } from "react";
import { GeoJSON, LayersControl, FeatureGroup, useMap } from "react-leaflet";
import { StateContext } from "../../../state/State";
import useSearchParams from "../../../components/hooks/useSearchQueryParams";
import * as turf from "@turf/turf";

export default function DetailMap({ checked }) {
  const {
    allCountyData,
    allWardData,
    allConstData,
    party,
    dispatch,
    publicLocation,
  } = useContext(StateContext);
  const d = allCountyData ? [...allCountyData] : [];
  const constD = allConstData ? [...allConstData] : [];
  const wardD = allWardData ? [...allWardData] : [];

  const county = useSearchParams("county");
  const constituency = useSearchParams("constituency");
  const ward = useSearchParams("ward");

  const geoJSON = useRef();
  const map = useMap();

  const countData = d.map((p) => p[0]).filter((f) => f.county === county);
  const constData = constD.filter((f) => f.const === constituency);
  const wardData = wardD.filter((f) => f.ward === ward);

  const data =
    wardData.length && Boolean(ward)
      ? wardData
      : constData.length
      ? constData
      : countData;

  if (geoJSON?.current?.getBounds()) {
    map.fitBounds(geoJSON?.current?.getBounds());
  }

  useEffect(() => {
    if (data?.length) {
      const mps = data?.map((t) => turf.centroid(t).geometry.coordinates) || [];

      const points = turf.points(mps);

      var center = turf.center(points);

      const lat = center.geometry.coordinates[1];
      const lng = center.geometry.coordinates[0];
      const payload = { lat, lng };
      dispatch({
        type: "ADD_MULTIPLE",
        context: "publicLocation",
        payload,
      });
    }
  }, [allCountyData, allWardData, allConstData]);

  if (!data.length) return null;

  return (
    <LayersControl.Overlay checked={checked} name="Region Outline">
      <FeatureGroup>
        {data?.length && (
          <div>
            {data?.map((d, i) => {
              return (
                <>
                  {publicLocation?.lat && publicLocation?.lng && (
                    <GeoJSON
                      ref={geoJSON}
                      key={d.id}
                      pathOptions={{ color: party?.primaryColor || "green" }}
                      data={d}
                    />
                  )}
                </>
              );
            })}
          </div>
        )}
      </FeatureGroup>
    </LayersControl.Overlay>
  );
}
