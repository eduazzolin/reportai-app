import React, {useEffect, useRef, useState} from "react";
import {registroPrototype, RegistroService} from "../app/service/registroService";
import {categoriaPrototype, CategoriaService} from "../app/service/categoriaService";
import {MapContainer, Marker, TileLayer, useMapEvents} from "react-leaflet";
import osm from "../app/service/osm-providers";
import Form from 'react-bootstrap/Form';
import {Button} from "react-bootstrap";
import L from 'leaflet'
import {mensagemErro, mensagemSucesso} from "../components/toastr";
import {ImagemService} from "../app/service/imagemService";
import {COORDENADAS_CENTRO} from "../app/service/appService";
import InputEndereco from "../components/inputEndereco/inputEndereco";
import {useNavigate} from "react-router-dom";

export default function CadastrarRegistro() {

  const zoom = 13; // 11 = 50 km  12 = 25 km  13 = 12 km  14 = 6 km  15 = 3 km  16 = 1.5 km  17 = 750 m  18 = 375 m  19 = 187 m  20 = 93 m
  const zoomSelecao = 16; // 11 = 50 km  12 = 25 km  13 = 12 km  14 = 6 km  15 = 3 km  16 = 1.5 km  17 = 750 m  18 = 375 m  19 = 187 m  20 = 93 m
  const centroMapa = COORDENADAS_CENTRO;
  const mapRef = useRef();


  const [categorias, setCategorias] = useState([categoriaPrototype])
  const [registro, setRegistro] = useState(registroPrototype)
  const [iconeCategoriaSelecionada, setIconeCategoriaSelecionada] = useState('')
  const [imagens, setImagens] = useState([null, null, null])
  const navigate = useNavigate();

  const registroService = new RegistroService();
  const categoriaService = new CategoriaService();
  const imagemService = new ImagemService();

  useEffect(() => {

    categoriaService
      .consultar()
      .then(response => {
        setCategorias(response.data)
        setIconeCategoriaSelecionada(response.data[0].icone);
        setRegistro({...registro, categoria: response.data[0]});
      }).catch(error => {
      mensagemErro(error.response.data.descricao)
    });


  }, []);

  // Atualiza o mapa para a posição do registro
  useEffect(() => {
    if (registro.latitude || registro.longitude) {
      mapRef.current.setView([registro.latitude, registro.longitude], zoomSelecao);
    }
  }, [registro.latitude, registro.longitude]);


  // Função que captura o click no mapa
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const {lat, lng} = e.latlng;
        if (registroService.calcularDistanciaDoCentro(lat, lng) > 30) {
          mensagemErro('O local do registro deve estar a menos de 30 km do centro');
        } else {
          setRegistro({...registro, latitude: lat, longitude: lng})
        }
      }
    });
    return null;
  }

  const cadastrar = async () => {
    try {

      try {
        registroService.validar(registro);
        imagemService.validar(imagens);
      } catch (erro) {
        const msgs = erro.mensagens;
        msgs.forEach(msg => mensagemErro(msg));
        return false;
      }

      const {data} = await registroService.salvar(registro);

      for (const imagem of imagens) {
        if (!imagem) continue;

        const formData = new FormData();
        formData.append('file', imagem);
        formData.append('idRegistro', data.id);

        try {
          await imagemService.salvar(formData);
          mensagemSucesso('Imagem cadastrada com sucesso!');
        } catch (error) {
          mensagemErro(error?.response?.data?.descricao ?? 'Erro ao cadastrar imagem');
          await registroService.deletar(data.id);
          throw error;
        }
      }

      mensagemSucesso('Registro cadastrado com sucesso!');
      navigate('/')
    } catch (error) {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao cadastrar registro');
    }
  };


  return (
    <div className='container'>


      {/*titulo*/}
      <div className="row mt-3">
        <div className="col-12">
          <h2>Crie um novo registro</h2>
        </div>
      </div>


      <div className="row mb-5 flex-row-reverse flex-lg-row">

        {/*formulário*/}
        <div className="col-lg-6 mt-3">
          <Form>

            {/*localizacao*/}
            <Form.Group className="mb-3">
              <Form.Label>Localização</Form.Label>
              <InputEndereco
                registro={registro}
                setRegistro={setRegistro}
              />
            </Form.Group>

            {/*titulo e categoria*/}
            <div className='row mb-3'>

              {/*titulo*/}
              <Form.Group className="col-md-6">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o título"
                  value={registro.titulo}
                  onChange={event => setRegistro({...registro, titulo: event.target.value})}/>
              </Form.Group>

              {/*categoria*/}
              <Form.Group className="col-md-6">
                <Form.Label>Categoria</Form.Label>
                <Form.Select
                  aria-label="Categoria"
                  value={registro.categoria.id}
                  onChange={event => {
                    const categoriaSelecionada = categorias.find(cat => cat.id == event.target.value);
                    setRegistro({...registro, categoria: categoriaSelecionada});
                    setIconeCategoriaSelecionada(categoriaSelecionada.icone)
                  }}>

                  {/*opções*/}
                  {categorias.map((categoria, index) => (
                    <option key={index} value={categoria.id}>{categoria.nome}</option>
                  ))}
                </Form.Select>
              </Form.Group>


            </div>

            {/*descrição*/}
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={registro.descricao}
                onChange={event => setRegistro({...registro, descricao: event.target.value})}/>
            </Form.Group>

            {/*imagens*/}
            <Form.Group className="mb-3">
              <Form.Label>Imagens</Form.Label>
              <div className="d-flex gap-1 flex-column">

                <Form.Control
                  type="file"
                  onChange={event => {
                    setImagens([event.target.files[0], imagens[1], imagens[2]]);
                  }}/>

                <Form.Control
                  type="file"
                  onChange={event => {
                    setImagens([imagens[0], event.target.files[0], imagens[2]]);
                  }}/>

                <Form.Control
                  type="file"
                  onChange={event => {
                    setImagens([imagens[0], imagens[1], event.target.files[0]]);
                  }}/>

              </div>
            </Form.Group>

          </Form>
        </div>


        {/*mapa*/}
        <div className="col-lg-6 mt-3">
          <Form.Label>Clique no mapa para inserir um marcador</Form.Label>
          <div className="rounded border overflow-hidden">
            <MapContainer
              center={centroMapa}
              zoom={zoom}
              ref={mapRef}
              style={{height: '395px', width: '100%'}}
            >
              <TileLayer
                url={osm.maptiler.url}
                attribution={osm.maptiler.attribution}
              />


              <MapClickHandler/>
              {registro.latitude && registro.longitude && (
                <Marker
                  position={[registro.latitude, registro.longitude]}
                  icon={
                    new L.Icon({
                      iconUrl: iconeCategoriaSelecionada,
                      iconSize: [32, 40],
                      iconAnchor: [16, 40]
                    })
                  }
                >
                </Marker>
              )}
            </MapContainer>
          </div>

          {/*botão*/}
          <div className="mt-3 d-flex justify-content-end">
            <Button variant="warning" onClick={() => cadastrar()}> Cadastrar </Button>
          </div>

        </div>


      </div>
    </div>
  )
}
