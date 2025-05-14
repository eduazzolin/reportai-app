import React, {useContext, useEffect, useRef, useState} from "react";
import {MapContainer, Marker, TileLayer, useMapEvents} from "react-leaflet";
import L from 'leaflet';
import osm from '../app/service/osm-providers';
import 'leaflet/dist/leaflet.css';
import {ORDENACOES_PERMITIDAS, RegistroService} from "../app/service/registroService";
import CardRegistroLateral from "../components/cardRegistroLateral/cardRegistroLateral";
import {COORDENADAS_CENTRO} from "../app/service/appService";
import {mensagemErro} from "../components/toastr";
import Form from "react-bootstrap/Form";
import {categoriaPrototype, CategoriaService} from "../app/service/categoriaService";
import {InteracaoService} from "../app/service/interacaoService";
import {AuthContext} from "../main/provedorAutenticacao";
import {useNavigate} from "react-router-dom";

export default function Home() {

  const ZOOM_SELECAO = 18;
  const FILTRO_STATUS_REGISTRO = [{label: 'Qualquer status', value: 'AND 0=0'}, {label: 'Abertos', value: 'AND NOT is_concluido'}, {label: 'Resolvidos', value: 'AND is_concluido'}]

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [zoom, setZoom] = useState(13);
  const [centroMapa, setCentroMapa] = useState(COORDENADAS_CENTRO);
  const [distanciaVisivel, setdistanciaVisivel] = useState(calcularDistanciaComBaseNoZoom(13));

  const [ordenacaoSelecionada, setOrdenacaoSelecionada] = useState(ORDENACOES_PERMITIDAS[0]);
  const [filtros, setFiltros] = useState(['AND 0=0', 'AND 0=0']);
  const [categorias, setCategorias] = useState([categoriaPrototype])
  const [registros, setRegistros] = useState([]);

  const cardRefs = useRef([]);
  const mapRef = useRef();

  const registroService = new RegistroService();
  const categoriaService = new CategoriaService();
  const interacaoService = new InteracaoService();

  /**
   * Carrega as categorias disponíveis e o título da página.
   */
  useEffect(() => {
    document.title = 'Reportaí';
    categoriaService
      .consultar()
      .then(response => {
        setCategorias(response.data)
      }).catch(error => {
      console.log(error);
    });
  }, []);

  /**
   * A cada mudança de zoom ou centro do mapa, atualiza a distância visível e busca os registros.
   */
  useEffect(() => {

    setdistanciaVisivel(calcularDistanciaComBaseNoZoom(zoom));

    registroService
      .consultar(centroMapa[0], centroMapa[1], distanciaVisivel, filtros.join(' '), ordenacaoSelecionada.value)
      .then(response => {
        setRegistros(response.data);
        console.log(response.data);
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao buscar registros');
    });

  }, [zoom, centroMapa, ordenacaoSelecionada, filtros]);


  /**
   * Calcula a distância visível no mapa com base no nível de zoom.
   * 11 = 50 km  12 = 25 km  13 = 12 km  14 = 6 km  15 = 3 km  16 = 1.5 km  17 = 750 m  18 = 375 m  19 = 187 m  20 = 93 m
   * @param zoomLevel
   * @returns {number} distância em km
   */
  function calcularDistanciaComBaseNoZoom(zoomLevel) {
    const baseDistancia = 50000;
    return (baseDistancia * Math.pow(2, -(zoomLevel - 11))) / 1000;
  }

  /**
   * Foca o mapa no registro selecionado.
   * @param registro
   */
  const focarMapaNoRegistro = (registro) => {
    mapRef.current.setView([registro.latitude, registro.longitude], ZOOM_SELECAO);
    setdistanciaVisivel(calcularDistanciaComBaseNoZoom(ZOOM_SELECAO));
  }

  /**
   * Foca o registro selecionado na timeline.
   * @param id
   */
  const highlightRegistro = (id) => {
    const card = cardRefs.current[id];
    if (card) {
      card.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  };

  /**
   * Componente que escuta os eventos do mapa e atualiza o estado.
   * @param onZoomChange
   * @param onCenterChange
   * @constructor
   */
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

      <div className={'row flex-row-reverse'}>

        {/* ---------------------- MAPA ------------------------*/}
        <div className="col-11 col-lg-5 p-0 mx-auto overflow-hidden custom-map-container">
          <MapContainer
            center={centroMapa}
            zoom={zoom}
            ref={mapRef}
            style={{width: '100%', height: '100%'}}
          >
            <TileLayer url={osm.maptiler.url} attribution={osm.maptiler.attribution}/>
            <MapEventsHandler
              onZoomChange={(novoZoom) => setZoom(novoZoom)}
              onCenterChange={(lat, lng) => setCentroMapa([lat, lng])}
            />

            {/*marcadores*/}
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
                  },
                }}
              >
              </Marker>
            ))}

          </MapContainer>
        </div>


        {/* ---------------------- TIMELINE ------------------------*/}
        <div className='col-lg-7 scrollable-lg'>

          {/*filtros*/}
          <div className="row  p-2 pb-1">

            {/*categoria*/}
            <div className="col-lg-4 col-6 mt-2">
              <Form.Select
                aria-label="Categoria"
                onChange={event => {
                  setFiltros([event.target.value, filtros[1]]);
                  console.log(filtros)
                }}>

                {/*opções*/}
                <option key={1} value={'AND 0=0'}>Qualquer categoria</option>
                {categorias.map((categoria, index) => (
                  <option key={index + 1} value={'AND categoria_id = ' + categoria.id}>{categoria.nome}</option>
                ))}
              </Form.Select>
            </div>

            {/*status*/}
            <div className="col-lg-4 col-6 mt-2">
              <Form.Select
                aria-label="status"
                onChange={event => {
                  setFiltros([filtros[0], event.target.value]);
                }}>
                {/*opções*/}
                {FILTRO_STATUS_REGISTRO.map((status, index) => (
                  <option key={index} value={status.value}>{status.label}</option>
                ))}
              </Form.Select>
            </div>

            {/*ordenação*/}
            <div className="col-lg-4 mt-2">
              <Form.Select
                aria-label="Ordenacao"
                onChange={event => {
                  setOrdenacaoSelecionada(ORDENACOES_PERMITIDAS.find(ordenacao => ordenacao.value === event.target.value));
                }}>
                {/*opções*/}
                {ORDENACOES_PERMITIDAS.map((ordenacao, index) => (
                  <option key={index} value={ordenacao.value}>{ordenacao.label}</option>
                ))}
              </Form.Select>
            </div>

          </div>


          <div className={'row p-3'}>
            {
              registros.map((registro, index) => (
                <div ref={(el) => cardRefs.current[registro.id] = el} key={index} className={'p-1 col-12'}>
                  <CardRegistroLateral
                    key={index}
                    focarMapaNoRegistro={focarMapaNoRegistro}
                    registro={registro}
                    interacaoService={interacaoService}/>
                </div>
              ))
            }
          </div>

          {
            registros.length > 0 ? '' :
              <div className={'row p-3 h-50'}>
                <div className="col-12 justify-content-center align-items-center d-flex text-center">
                  ℹ️ <br/>
                  Nenhum registro encontrado! <br/>
                  Experimente navegar no mapa ou alterar os filtros.
                </div>
              </div>
          }


        </div>


      </div>
    </div>
  )
    ;
}
