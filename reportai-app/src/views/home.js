import React, {useRef, useEffect, useState} from "react";
import './homeStyle.css'
import {MapContainer, TileLayer, Marker} from "react-leaflet"
import osm from '../app/service/osm-providers'
import 'leaflet/dist/leaflet.css'
import {consultar} from "../app/service/registroService";

export default function Home() {
  const [center, setCenter] = useState([-27.6012, -48.4812]) // [latitude, longitude]
  const [zoom, setZoom] = useState(11)
  const [registros, setRegistros] = useState([])
  const mapRef = useRef();

  const mountPage = async () => {
    try {
      const response_registros = await consultar()
      setRegistros(response_registros)
    } catch (error) {
      console.log("Erro ao buscar dados", error)
    }
  }

  useEffect(() => {
    mountPage();
  }, []);

  function addMarkrs() {
    console.log(registros)
  }

  return (
    <div className={'container-fluid'}>
      <div className={'row'}>

        <div className={'col-4 border sidebar'}>
          <div className={'row p-3 gap-3'}>
            <div className={'col-12 bg-light border rounded placeholder_adicionar justify-content-center align-content-center'}>
              <button className={'btn btn-primary m-auto'} onClick={addMarkrs}>Testar</button>
            </div>
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