import React, {useRef} from "react";
import './homeStyle.css'
import {MapContainer, TileLayer} from "react-leaflet"
import osm from '../app/service/osm-providers'
import 'leaflet/dist/leaflet.css'

export default function Home() {
  const [center, setCenter] = React.useState([-27.6012, -48.4812]) // [latitude, longitude]
  const [zoom, setZoom] = React.useState(11)
  const mapRef = useRef();

  return (
    <div className={'container-fluid'}>
      <div className={'row'}>

        <div className={'col-4 border sidebar'}>
          <div className={'row p-3 gap-3'}>
            <div className={'col-12 bg-light border rounded placeholder_adicionar'}></div>
            <div className={'col-12 bg-light border rounded placeholder_card'}></div>
            <div className={'col-12 bg-light border rounded placeholder_card'}></div>
            <div className={'col-12 bg-light border rounded placeholder_card'}></div>
            <div className={'col-12 bg-light border rounded placeholder_card'}></div>
          </div>
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