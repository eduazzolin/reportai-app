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
import {mensagemErro} from "../components/toastr";

export default function Home() {

  const zoomSelecao = 16;
  const mapRef = useRef();
  const [zoom, setZoom] = useState(13); // 11 = 50 km  12 = 25 km  13 = 12 km  14 = 6 km  15 = 3 km  16 = 1.5 km  17 = 750 m  18 = 375 m  19 = 187 m  20 = 93 m
  const [centroMapa, setCentroMapa] = useState(COORDENADAS_CENTRO);
  const [distanciaVisivel, setdistanciaVisivel] = useState(calcularDistanciaComBaseNoZoom(13));

  const [registros, setRegistros] = useState([]);
  const cardRefs = useRef([]);

  const navigate = useNavigate();
  const registroService = new RegistroService();


  // a cada mudança de zoom ou no centro do mapa, atualiza os registros
  useEffect(() => {

    setdistanciaVisivel(calcularDistanciaComBaseNoZoom(zoom));

    registroService
      .consultar(centroMapa[0], centroMapa[1], distanciaVisivel)
      .then(response => {
        setRegistros(response.data);
        console.log(response.data);
    }).catch(error => {
      mensagemErro(error.response.data.descricao);
    });

  }, [zoom, centroMapa]);

  function calcularDistanciaComBaseNoZoom(zoomLevel) {
    const baseDistancia = 50000;
    return (baseDistancia * Math.pow(2, -(zoomLevel - 11))) / 1000;
  }

  const focarMapaNoRegistro = (registro) => {
    console.log([registro.latitude, registro.longitude]);
    mapRef.current.setView([registro.latitude, registro.longitude], 20);
  }

  const highlightRegistro = (id) => {
    const card = cardRefs.current[id];
    if (card) {
      card.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  };

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
  }


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
            center={centroMapa}
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
                setCentroMapa([lat, lng]);
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
