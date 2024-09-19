import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {consultarPorId} from "../app/service/registroService";
import {FaMapMarkerAlt, FaUserCircle} from "react-icons/fa";
import {MdDateRange} from "react-icons/md";
import {formatarDataHora, formatarDescricao} from "../app/service/appService";
import {AiFillLike} from "react-icons/ai";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import osm from "../app/service/osm-providers";
import L from "leaflet";


export default function DetalhesRegistro() {
  const {id} = useParams();
  const [registro, setRegistro] = useState(null);

  useEffect(() => {
    mountPage();
  }, [id]);

  const mountPage = async () => {
    try {
      const response_registro = await consultarPorId(id);
      setRegistro(response_registro);
    } catch (error) {
      console.log("Erro ao buscar dados", error);
    }
  };

  if (!registro) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container py-4'>
      <div className="row">

        <div className="col-12 my-4">
          <h2>{registro.titulo}</h2>
        </div>

        <div className="col-12 mb-4">
          <div className='d-flex gap-2 align-items-center mb-1'>
            <FaMapMarkerAlt height={24}/>
            <span className='small'>{registro.localizacao}</span>
          </div>

          <div className='d-flex gap-2 align-items-center mb-1'>
            <FaUserCircle height={24}/>
            <span className='small'>{registro.usuario.nome}</span>
          </div>

          <div className='d-flex gap-2 align-items-center mb-1'>
            <MdDateRange height={24}/>
            <span className='small'>{formatarDataHora(registro.dt_criacao)}</span>
          </div>

          <div className='d-flex gap-2 align-items-center mb-1'>
            <AiFillLike height={24}/>
            <span className='small'>{registro.interacao_likes.length} curtida(s)</span>
          </div>
        </div>

        <div className="col-12 texto_justificado mb-4">
          {formatarDescricao(registro.descricao)}
        </div>

        <div className="col-12 mb-4">
          <div className="rounded border overflow-hidden">
            <MapContainer
              center={registro.latitude && registro.longitude ? [registro.latitude, registro.longitude] : [-27.6012, -48.4812]}
              zoom={16}
              style={{height: 'calc(100vh - 230px)', width: '100%'}}
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

        <div className="col-12 mb-4">
          <div className='d-flex gap-3'>
            {registro.imagens.map((imagem, index) => (
              <div key={index} className=''>
                <img src={imagem.caminho} className='img-fluid' alt='...'/>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}
