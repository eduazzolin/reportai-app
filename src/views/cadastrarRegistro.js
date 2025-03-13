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

export default function CadastrarRegistro() {

  const [zoom, setZoom] = useState(13); // 11 = 50 km  12 = 25 km  13 = 12 km  14 = 6 km  15 = 3 km  16 = 1.5 km  17 = 750 m  18 = 375 m  19 = 187 m  20 = 93 m
  const [latitude, setLatitude] = useState(COORDENADAS_CENTRO[0]);
  const [longitude, setLongitude] = useState(COORDENADAS_CENTRO[1]);
  const mapRef = useRef();


  const [categorias, setCategorias] = useState([categoriaPrototype])
  const [registro, setRegistro] = useState(registroPrototype)
  const [iconeCategoriaSelecionada, setIconeCategoriaSelecionada] = useState('')
  const [imagens, setImagens] = useState([null, null, null])


  const registroService = new RegistroService();
  const categoriaService = new CategoriaService();
  const imagemService = new ImagemService();

  useEffect(() => {

    categoriaService
      .consultar()
      .then(response => {
        setCategorias(response.data)
      }).catch(error => {
      mensagemErro(error.response.data.descricao)
    });


  }, []);


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

  const cadastrar = () => {

    registroService.salvar(registro).then(response => {
      console.log(response)
    }).catch(error => {
      mensagemErro('Erro ao cadastrar imagem')
    })

    const id_registro = 1

    for (let i = 0; i < imagens.length; i++) {
      if (imagens[i]) {
        const formdata = new FormData();
        formdata.append('file', imagens[i]);
        formdata.append('idRegistro', id_registro);
        imagemService.salvar(formdata).then(response => {
          mensagemSucesso('Imagem cadastrada com sucesso!')
        }).catch(error => {
          mensagemErro('Erro ao cadastrar imagem')
        })
      }
    }

  }

  return (
    <div className='container'>


      {/*titulo*/}
      <div className="row mt-5">
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
              <Form.Label>Descrição do local</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descreva a localização"
                value={registro.localizacao}
                onChange={event => setRegistro({...registro, localizacao: event.target.value})}/>
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
                rows={5}
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
              center={[latitude, longitude]}
              zoom={zoom}
              ref={mapRef}
              style={{height: 'calc(100vh - 223px)', width: '100%'}}
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
        </div>

        {/*botão*/}
        <div className="col-lg-6 mt-2">

        <Button variant="warning" onClick={() => cadastrar()}> Cadastrar </Button>
        </div>

      </div>
    </div>
  )
}
