import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {FaMapMarkerAlt, FaUserCircle} from "react-icons/fa";
import {MdDateRange} from "react-icons/md";
import {formatarDataHora, formatarDescricao} from "../app/service/appService";
import {MapContainer, Marker, TileLayer} from "react-leaflet";
import osm from "../app/service/osm-providers";
import L from "leaflet";
import {RegistroService} from "../app/service/registroService";
import {mensagemErro} from "../components/toastr";
import {BsArrowUpSquareFill, BsCheckSquareFill} from "react-icons/bs";
import {FaTreeCity} from "react-icons/fa6";
import {InteracaoService} from "../app/service/interacaoService";
import {Button} from "react-bootstrap";


export default function VerRegistro() {

  const {id} = useParams();
  const [registro, setRegistro] = useState(null);
  const [interacoes, setInteracoes] = useState([]);
  const [mensagemCentral, setMensagemCentral] = useState('ℹ️ Carregando registro...');

  const service = new RegistroService();
  const interacaoService = new InteracaoService();
  const mapRef = useRef();

  useEffect(() => {

    service.consultarPorId(id).then((response) => {
      setRegistro(response.data);
      interacaoService.buscarRelevantes(id).then((response) => {
        setInteracoes(response.data);
      }).catch((error) => {
        setMensagemCentral('❌ ' + error?.response?.data?.descricao ?? 'Erro ao buscar interações.');
      })
    }).catch((error) => {
      setMensagemCentral('❌ ' + error?.response?.data?.descricao ?? 'Erro ao buscar registro.');
    })

    document.title = `Reportaí - ${registro?.titulo ?? 'Registro'}`;

  }, [id]);


  const handlePrint = () => {

    const map = mapRef.current;
    if (map) {
      map._container.style.height = '500px';
      map._container.style.width = '600px';
      map.invalidateSize(false);
    }

    window.print();
    if (map) {
      map._container.style.height = 'calc(100vh - 230px)';
      map._container.style.width = '100%';
      map.invalidateSize(false);
    }

  };
  if (!registro) {
    return (
      <div className="justify-content-center align-items-center d-flex text-center mt-5">
        {mensagemCentral}
      </div>);
  }


  return (
    <div className='container pb-4'>

      {/* ---------------------- cabeçalho ---------------------- */}
      <div className="row my-2 mt-4">

        {/* título */}
        <div className="col-12 my-2 d-flex justify-content-between align-items-center">
          <h1>{registro.titulo}</h1>
          <Button onClick={handlePrint} className='my-auto' variant="warning">Imprimir</Button>
        </div>

        {/* ícones */}
        <div className="col-12 mb-4">
          <div className='d-flex gap-2 align-items-center mb-1'>
            <FaMapMarkerAlt height={24}/>
            <span className='small'>{registro.localizacao}</span>
          </div>

          <div className='d-flex gap-2 align-items-center mb-1'>
            <FaTreeCity height={24}/>
            <span className='small'>{registro.bairro}</span>
          </div>

          <div className='d-flex gap-2 align-items-center mb-1'>
            <FaUserCircle height={24}/>
            <span className='small'>{registro.usuario.nome}</span>
          </div>

          <div className='d-flex gap-2 align-items-center mb-1'>
            <MdDateRange height={24}/>
            <span className='small'>{formatarDataHora(registro.dtCriacao)}</span>
          </div>

          <div className='d-flex gap-2 align-items-center mb-1'>
            <BsArrowUpSquareFill height={24}/>
            <span
              className='small'>{registro.interacoesRelevante ? `${registro.interacoesRelevante} usuário${registro.interacoesRelevante > 1 ? 's' : ''} marc${registro.interacoesRelevante > 1 ? 'aram' : 'ou'} como relevante` : 'Nenhum usuário marcou como relevante até o momento'}</span>
          </div>

          {
            registro.isConcluido ?
              <div className='d-flex gap-2 align-items-center mb-1'>
                <BsCheckSquareFill height={24}/>
                <span className='small'>Concluído em {formatarDataHora(registro.dtConclusao)}</span>
              </div>
              :
              <div>
              </div>
          }

        </div>
      </div>

      {/* ---------------------- descrição ---------------------- */}
      <div className="row my-2">
        <div className="col-12 texto_justificado">
          {formatarDescricao(registro.descricao)}
        </div>
      </div>

      {/* ---------------------- mapa ---------------------- */}
      <div className="row my-2 page-break">
        <div className="col-12 mb-2">
          <h4 className=''>Localização</h4>
        </div>
        <div className="col-12">
          <div className="rounded border overflow-hidden print-map">
            <MapContainer
              className=""
              ref={mapRef}
              center={registro.latitude && registro.longitude ? [registro.latitude, registro.longitude] : [-27.6012, -48.4812]}
              zoom={16}
              style={{height: 'calc(100vh - 230px)', width: '100%'}}
              dragging={false}          // Disable map dragging/panning
              touchZoom={false}         // Disable pinch-zoom on touch devices
              scrollWheelZoom={false}   // Disable zoom with scroll wheel
              doubleClickZoom={false}   // Disable zoom on double click
              boxZoom={false}           // Disable box zoom
              keyboard={false}          // Disable keyboard navigation
              zoomControl={false}       // Hide zoom controls

            >
              <TileLayer
                url={osm.maptiler.url}
                attribution={osm.maptiler.attribution}
              />
              <Marker
                position={[registro.latitude, registro.longitude]}
                icon={
                  new L.Icon({
                    iconUrl: registro.categoria.icone,
                    iconSize: [32, 40],
                    iconAnchor: [16, 40]
                  })
                }
              >
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>


      {/* ---------------------- imagens ---------------------- */}
      {
        registro.imagens.length > 0 &&
        <div className="row my-4  page-break">
          <div className="col-12 mb-2">
            <h4 className=''>Imagens</h4>
          </div>
          <div className="col-12 d-flex gap-3 vr_imagem_row">
            {registro.imagens.map((imagem, index) => (
              <div key={index} className=''>
                <img src={imagem.caminho} className='img-fluid clicavel vr_imagem' alt='...' onClick={() => {
                  window.open(imagem.caminho, '_blank')
                }}/>
              </div>
            ))}
          </div>
        </div>
      }


      {/* ---------------------- interações ---------------------- */}
      {
        registro.interacoesRelevante > 0 &&
        <div className="row my-4 page-break">
          <div className="col-12 mb-2">
            <h4 className=''>Pessoas que consideram o registro relevante</h4>
          </div>

          {
            interacoes.map((interacao, index) => (
              <div key={index} className="col-12 d-flex gap-2 mb-2 align-items-center">
                <BsArrowUpSquareFill size={24}/>
                <span className=''>{interacao.usuario}</span>
                <span className='text-black-50'>{formatarDataHora(interacao.dtCriacao)} </span>
              </div>
            ))
          }
        </div>
      }

    </div>
  );
}
