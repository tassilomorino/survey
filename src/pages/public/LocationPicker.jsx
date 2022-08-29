import { useState, useRef, useMemo, useCallback, useContext, useEffect } from "react";
import { useMapEvents, Marker, Popup, useMap } from "react-leaflet";
import { useParams } from "react-router-dom";
import { StateContext } from "../../state/State";
import L, { divIcon } from "leaflet"
import { renderToStaticMarkup } from "react-dom/server";
import { PeoplesIcons } from "../elections/AtlasAdminSidebar"

export default function LocationPicker() {
  const [position, setPosition] = useState(null);
  const { dispatch, useCurrentLocation } = useContext(StateContext);
  const markerRef = useRef(null);
  const map = useMapEvents({
    click() {
      if ((useCurrentLocation)) {
        map.locate();
      }
    },
    locationfound(e) {
      setPosition(e.latlng);
      dispatch({
        type: "ADD_MULTIPLE",
        payload: e.latlng,
        context: "publicLocation",
      });
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          dispatch({
            type: "ADD_MULTIPLE",
            payload: marker.getLatLng(),
            context: "publicLocation",
          });
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );



  return (
    <>
      {position && (
        <Marker
          ref={markerRef}
          eventHandlers={eventHandlers}
          draggable
          position={position}
        >
          <Popup minWidth={90}>
            <span>Drag marker to preffered location </span>
          </Popup>
        </Marker>
      )}
    </>
  );
}


export function PublicLocationMarker() {
  const { dispatch, publicLocation, allCoutyData } = useContext(StateContext);
  const markerRef = useRef(null);
  const map = useMap()

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          dispatch({
            type: "ADD_MULTIPLE",
            payload: marker.getLatLng(),
            context: "publicLocation",
          });
          map.flyTo(marker.getLatLng(), map.getZoom());
        }
      },
    }),
    []
  );

  

  return (
    <>
      {Boolean(publicLocation?.lat && publicLocation?.lng) && (
        <Marker
          ref={markerRef}
          eventHandlers={eventHandlers}
          draggable
          position={publicLocation}
        >
          <Popup minWidth={90}>
            <span>Drag marker to your approximate location </span>
          </Popup>
        </Marker>
      )}
    </>
  );
}


export function IDMarker() {
  const [position, setPosition] = useState(null);
  const { dispatch, publicLocation } = useContext(StateContext);
  const [draggable, setDraggable] = useState(false);
  const markerRef = useRef(null);
  const map = useMap()


  const { context, id } = useParams()

  const { officials } = useContext(StateContext)

  const data = officials || []
  const piece = data.filter(f => f.id === id)[0]


  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          dispatch({
            type: "ADD_MULTIPLE",
            payload: marker.getLatLng(),
            context: "publicLocation",
          });
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);


  useEffect(() => {
    if (piece?.geom) {
      map.flyTo([piece.geom.coordinates[1], piece.geom.coordinates[0]], 12);

    }
    if (!Boolean(id)) {
      map.flyTo([0.0236, 37.9062], 6);
    }
  }, [piece])


  const getIcon = () => {
    const iconMarkup = renderToStaticMarkup(
      <>
        {PeoplesIcons[context]}
      </>
    );
    return divIcon({
      html: iconMarkup
    });
  }

  return (
    <>
      {Boolean(piece?.geom) && (
        <Marker
          ref={markerRef}
          eventHandlers={eventHandlers}
          draggable
          icon={getIcon()}
          position={[piece.geom.coordinates[1], piece.geom.coordinates[0]]}
        >
          <Popup minWidth={90}>
            <span>Drag marker to your approximate location </span>
          </Popup>
        </Marker>
      )}
    </>
  );
}
