import React, {useRef, useEffect, useState} from "react";
import './homeStyle.css'
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet"
import L from 'leaflet'
import osm from '../../app/service/osm-providers'
import 'leaflet/dist/leaflet.css'
import {consultar} from "../../app/service/registroService";
import CardRegistroLateral from "../../components/cardRegistroLateral/cardRegistroLateral";

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


  return (
    <div className={'container-fluid'}>
      <div className={'row'}>

        <div className={'col-lg-5 col-8 sidebar'}>
          <div className={'row p-3 gap-3'}>
            <div className={'col-12 bg-light border rounded placeholder_adicionar justify-content-center align-content-center'}>
            </div>
            {
              registros.map((registro, index) => (
                <CardRegistroLateral key={index} registro={registro}/>
              ))
            }

            <div className={'col-12 bg-light border rounded placeholder_card'}></div>
            <div className={'col-12 bg-light border rounded placeholder_card'}></div>
            <div className={'col-12 bg-light border rounded placeholder_card'}></div>
            <div className={'col-12 bg-light border rounded placeholder_card'}></div>
          </div>
        </div>

        <div className={'col-lg-7 col-4 p-0'}>
          <MapContainer
            center={center}
            zoom={zoom}
            ref={mapRef}
          >
            <TileLayer
              url={osm.maptiler.url}
              attribution={osm.maptiler.attribution}
            />

            {registros.map((registro, index) => (
              <Marker
                key={index}
                position={[registro.latitude, registro.longitude]}
                icon={
                  new L.Icon({
                    iconUrl: registro.categoria.icone,
                    iconSize: [32, 40],
                    iconAnchor: [16, 40]
                  })
                }
              >
                <Popup>
                  <div className={'card'}>
                    <div className={'card-body'}>
                      <h5 className={'card-title'}>{registro.titulo}</h5>
                      <p className={'card-text'}>{registro.descricao}</p>
                      <p className={'card-text'}><small className={'text-muted'}>{registro.localizacao}</small></p>
                    </div>
                  </div>
                </Popup>

              </Marker>
            ))}

          </MapContainer>
        </div>

      </div>
    </div>
  );
}