import React, {useEffect, useRef, useState} from "react";
import {registroPrototype} from "../app/service/registroService";
import {consultarCategorias} from "../app/service/categoriaService";
import {MapContainer, Marker, Popup, TileLayer, useMapEvents} from "react-leaflet";
import osm from "../app/service/osm-providers";
import Form from 'react-bootstrap/Form';
import {Button} from "react-bootstrap";
import L from 'leaflet'

export default function NovoRegistro() {
  const [center, setCenter] = useState([-27.6012, -48.4812]) // [latitude, longitude]
  const [zoom, setZoom] = useState(11)
  const mapRef = useRef();
  const [categorias, setCategorias] = useState([])
  const [registro, setRegistro] = useState(registroPrototype)
  const [iconeCategoriaSelecionada, setIconeCategoriaSelecionada] = useState('')

  const mountPage = async () => {
    try {
      const response_categorias = await consultarCategorias()
      setCategorias(response_categorias)
      setIconeCategoriaSelecionada(response_categorias[0].icone)
    } catch (error) {
      console.log("Erro ao buscar dados", error)
    }
  }

  useEffect(() => {
    mountPage();
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setRegistro({...registro, latitude: lat, longitude: lng})
      }
    });
    return null;
  }

  return (
    <div className={'container-fluid'}>
      <div className={'row  px-5 py-4 '}>
        <div className={'col-12  mb-3'}>
          <h3>Novo Registro</h3>
        </div>
        <div className={'col-12'}>
          <Form>
            <div className="container-fluid">
              <div className="row p-0">

                <div className="col-6  ">

                  <Form.Group className="mb-3">
                    <Form.Label>Descrição do local</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite a descrição do local"
                      value={registro.localizacao}
                      onChange={event => setRegistro({...registro, titulo: event.target.value})}/>
                  </Form.Group>

                  <div className='gap-3 d-flex'>
                    <Form.Group className="mb-3 flex-grow-1">
                      <Form.Label>Título</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Digite o título"
                        value={registro.titulo}
                        onChange={event => setRegistro({...registro, titulo: event.target.value})}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Categoria</Form.Label>
                      <Form.Select
                        aria-label="Categoria"
                        value={registro.categoria.id}
                        onChange={event => {
                          setRegistro({...registro, categoria: {id: event.target.value}});
                          setIconeCategoriaSelecionada(categorias.find(categoria => categoria.id == event.target.value).icone)
                        }
                        }>
                        {
                          categorias.map((categoria, index) => (
                            <option key={index} value={categoria.id}>{categoria.nome}</option>
                          ))
                        }
                      </Form.Select>
                    </Form.Group>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={registro.descricao}
                      onChange={event => setRegistro({...registro, descricao: event.target.value})}/>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Imagens</Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      onChange={event => setRegistro({...registro, imagens: event.target.files})}/>
                  </Form.Group>

                  <Button variant="primary" onClick={() => console.log(registro)}> test </Button>
                </div>

                <div className='col-6 '>
                  <Form.Group className="mb-3">
                    <Form.Label>Clique no mapa para inserir um marcador</Form.Label>
                    <div className="rounded border overflow-hidden">
                      <MapContainer
                        center={center}
                        zoom={zoom}
                        ref={mapRef}
                        style={{height: 'calc(100vh - 230px)', width: '100%'}}
                      >
                        <TileLayer
                          url={osm.maptiler.url}
                          attribution={osm.maptiler.attribution}
                        />
                        <MapClickHandler />
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
                  </Form.Group>
                </div>

              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
