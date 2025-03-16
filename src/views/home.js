import React, {useEffect, useRef, useState} from "react";
import {MapContainer, Marker, TileLayer, useMapEvents} from "react-leaflet";
import L from 'leaflet';
import osm from '../app/service/osm-providers';
import 'leaflet/dist/leaflet.css';
import {RegistroService} from "../app/service/registroService";
import CardRegistroLateral from "../components/cardRegistroLateral/cardRegistroLateral";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {COORDENADAS_CENTRO} from "../app/service/appService";

function MapEventsHandler({onZoomChange, onCenterChange}) {
  // Esse hook permite "ouvir" eventos do mapa
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
    moveend: () => {
      const center = map.getCenter();
      onCenterChange(center.lat, center.lng);
    },
  });

  return null; // Esse componente não renderiza nada visível
}

export default function Home() {
  const [registros, setRegistros] = useState([]);
  const mapRef = useRef();
  const cardRefs = useRef([]);
  const [activeRegistroId, setActiveRegistroId] = useState(null);
  const [zoom, setZoom] = useState(13); // 11 = 50 km  12 = 25 km  13 = 12 km  14 = 6 km  15 = 3 km  16 = 1.5 km  17 = 750 m  18 = 375 m  19 = 187 m  20 = 93 m
  const [latitude, setLatitude] = useState(COORDENADAS_CENTRO[0]);
  const [longitude, setLongitude] = useState(COORDENADAS_CENTRO[1]);
  const [distancia, setDistancia] = useState(calculateDistance(13));

  // Função para calcular a distância com base no zoom
  function calculateDistance(zoomLevel) {
    const baseDistance = 50000; // Distância para zoom 11
    return (baseDistance * Math.pow(2, -(zoomLevel - 11))) / 1000;
  }


  const navigate = useNavigate();
  const registroService = new RegistroService();


  useEffect(() => {
    setDistancia(calculateDistance(zoom));
    registroService.consultar(latitude, longitude, distancia).then(response => {
      setRegistros(response.data);
    }).catch(error => {
      console.log('Erro ao buscar projetos');
    });


  }, [zoom, latitude, longitude]);

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
            center={[latitude, longitude]}
            zoom={zoom}
            ref={mapRef}
            style={{height: 'calc(100vh - 60px)', width: '100%'}}
          >
            <TileLayer
              url={osm.maptiler.url}
              attribution={osm.maptiler.attribution}
            />
            {/* Componente que "escuta" os eventos e atualiza o estado */}
            <MapEventsHandler
              onZoomChange={(novoZoom) => setZoom(novoZoom)}
              onCenterChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
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
