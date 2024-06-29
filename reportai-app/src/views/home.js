import React, {useRef} from "react";
import './homeStyle.css'
import {MapContainer, TileLayer} from "react-leaflet"
import osm from '../app/service/osm-providers'
import 'leaflet/dist/leaflet.css'

export default function Home() {
  const [center, setCenter] = React.useState([-23.5505, -46.6333]) // [latitude, longitude]
  const [zoom, setZoom] = React.useState(13)
  const mapRef = useRef();

  return (
    <div className={'container-fluid'}>
      <div className={'row'}>

        <div className={'col-4 border sidebar'}>

        </div>

        <div className={'col-8 border'}>
          <MapContainer
            center={center}
            zoom={zoom}
            ref={mapRef}
          >
            <TileLayer
              url={osm.maptiler.url}
              attribution={osm.maptiler.attribution}
              />
          </MapContainer>
        </div>

      </div>
    </div>
  );
}