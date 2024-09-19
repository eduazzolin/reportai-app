import React, {useEffect, useRef, useState} from "react";
import {MapContainer, Marker, TileLayer} from "react-leaflet";
import L from 'leaflet';
import osm from '../app/service/osm-providers';
import 'leaflet/dist/leaflet.css';
import {consultar} from "../app/service/registroService";
import CardRegistroLateral from "../components/cardRegistroLateral/cardRegistroLateral";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";


export default function Home() {
  const [registros, setRegistros] = useState([]);
  const mapRef = useRef();
  const cardRefs = useRef([]);
  const [activeRegistroId, setActiveRegistroId] = useState(null);

  const navigate = useNavigate();

  const mountPage = async () => {
    try {
      const response_registros = await consultar();
      setRegistros(response_registros);
    } catch (error) {
      console.log("Erro ao buscar dados", error);
    }
  };

  useEffect(() => {
    mountPage();
  }, []);

  const focarMapaNoRegistro = (registro) => {
    console.log([registro.latitude, registro.longitude]);
    mapRef.current.setView([registro.latitude, registro.longitude], 20);
  }

  const highlightRegistro = (id) => {
    setActiveRegistroId(id);
    const card = cardRefs.current[id];
    if (card) {
      card.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  };

  return (
    <div className={'container-fluid'}>
      <div className={'row'}>

        {/* ---------------------- SIDEBAR ------------------------*/}

        <div className={'col-lg-5 col-8 sidebar'}>
          <div className={'row p-3 gap-3'}>
            <div className={'col-12'}>
              <Button variant="warning" className={'w-100'} onClick={() => navigate('/novo-registro')}>Adicionar
                Registro</Button>
            </div>
            {
              registros.map((registro, index) => (
                <div ref={(el) => cardRefs.current[registro.id] = el} key={index} className={'p-0'}>
                  <CardRegistroLateral
                    key={index}
                    focarMapaNoRegistro={focarMapaNoRegistro}
                    registro={registro}/>
                </div>
              ))
            }
          </div>
        </div>


        {/* ---------------------- MAPA ------------------------*/}

        <div className={'col-lg-7 col-4 p-0'}>
          <MapContainer
            center={[-27.6012, -48.4812]}
            zoom={11}
            ref={mapRef}
            style={{height: 'calc(100vh - 60px)', width: '100%'}}
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
                eventHandlers={{
                  click: () => {
                    highlightRegistro(registro.id);
                    focarMapaNoRegistro(registro);
                  },
                }}
              >
              </Marker>
            ))}
          </MapContainer>
        </div>


      </div>
    </div>
  );
}
