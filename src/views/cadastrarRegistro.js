import React, {useEffect, useRef, useState} from "react";
import {registroPrototype, RegistroService} from "../app/service/registroService";
import {categoriaPrototype, CategoriaService} from "../app/service/categoriaService";
import {MapContainer, Marker, TileLayer, useMapEvents} from "react-leaflet";
import osm from "../app/service/osm-providers";
import Form from 'react-bootstrap/Form';
import {Button, Spinner} from "react-bootstrap";
import L from 'leaflet'
import {mensagemErro, mensagemSucesso} from "../components/toastr";
import {ImagemService} from "../app/service/imagemService";
import {COORDENADAS_CENTRO} from "../app/service/appService";
import InputEndereco from "../components/inputEndereco/inputEndereco";
import {useLocation, useNavigate} from 'react-router-dom';

import PopupSimples from "../components/popupSimples/PopupSimples";
import IaService from "../app/service/iaService";
import PopupCorrecao from "../components/popupCorrecao/popupCorrecao";
import PopupConfirmacao from "../components/popupConfirmacao/popupConfirmacao";
import BlocoImagem from "../components/blocoImagem/blocoImagem";
import {obterBairroLocalizacaoPorLatLong} from "../app/service/mapService";

export default function CadastrarRegistro() {

  const zoom = 13; // 11 = 50 km  12 = 25 km  13 = 12 km  14 = 6 km  15 = 3 km  16 = 1.5 km  17 = 750 m  18 = 375 m  19 = 187 m  20 = 93 m
  const zoomSelecao = 16; // 11 = 50 km  12 = 25 km  13 = 12 km  14 = 6 km  15 = 3 km  16 = 1.5 km  17 = 750 m  18 = 375 m  19 = 187 m  20 = 93 m
  const centroMapa = COORDENADAS_CENTRO;
  const mapRef = useRef();

  const location = useLocation();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([categoriaPrototype])
  const [registro, setRegistro] = useState(registroPrototype)
  const registroRecebido = location.state?.registro;
  const [iconeCategoriaSelecionada, setIconeCategoriaSelecionada] = useState('/markers/general.svg')
  const [imagens, setImagens] = useState([null, null, null])
  const [imagemIdxParaRemover, setImagemIdxParaRemover] = useState(null)
  const [checkRegras, setCheckRegras] = useState(false)
  const [visibilidadePopupRegras, setVisibilidadePopupRegras] = useState(false)
  const [visibilidadePopupCorrecao, setVisibilidadePopupCorrecao] = useState(false)
  const [visibilidadePopupRemocao, setVisibilidadePopupRemocao] = useState(false)
  const [correcaoTextoCorrigido, setCorrecaoTextoCorrigido] = useState('')
  const [correcaoTipo, setCorrecaoTipo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const registroService = new RegistroService();
  const categoriaService = new CategoriaService();
  const imagemService = new ImagemService();
  const iaService = new IaService();

  /**
   * Carrega o registro recebido, se houver
   */
  useEffect(() => {
    if (registroRecebido) {
      setRegistro(registroRecebido);
      setCheckRegras(true);
      setIconeCategoriaSelecionada(registroRecebido.categoria.icone)
    }
  }, [registroRecebido]);

  /**
   * Carrega as categorias disponíveis e o título da página.
   */
  useEffect(() => {
    document.title = 'Reportaí - Cadastrar Registro';
    categoriaService
      .consultar()
      .then(response => {
        setCategorias(response.data)
        if (!registroRecebido) {
          setRegistro({...registro, categoria: response.data[0]})
          setIconeCategoriaSelecionada(response.data[0].icone)
        }
      }).catch(error => {
      console.log(error);
    });


  }, []);

  /**
   * Atualiza o mapa para a posição do registro
   */
  useEffect(() => {
    if (registro.latitude || registro.longitude) {
      mapRef.current.setView([registro.latitude, registro.longitude], zoomSelecao);
    }
  }, [registro.latitude, registro.longitude]);


  /**
   * Função que trata o clique no mapa
   * @constructor
   */
  const MapClickHandler = () => {
    useMapEvents({
      async click(e) {
        const {lat, lng} = e.latlng;
        if (registroService.calcularDistanciaDoCentro(lat, lng) > 30) {
          mensagemErro('O local do registro deve estar a menos de 30 km do centro');
        } else {
          const [bairro, localizacao] = await obterBairroLocalizacaoPorLatLong(lat, lng);
          setRegistro({...registro, latitude: lat, longitude: lng, bairro, localizacao});
        }
      }
    });
    return null;
  }

  /**
   * Cadastra o registro e as imagens
   */
  const cadastrar = async () => {
    if (checkRegras) {
      try {
        setIsLoading(true);
        console.log(registro)


        // validações
        try {
          registroService.validar(registro);
          imagemService.validar(imagens);
        } catch (erro) {
          const msgs = erro.mensagens;
          msgs.forEach(msg => mensagemErro(msg));
          return false;
        }

        // correção com IA
        const respCorrecaoTitulo = await iaService.corrigir(registro.titulo);
        const respCorrecaoTituloData = respCorrecaoTitulo.data;
        if (!respCorrecaoTituloData.valido) {
          setCorrecaoTextoCorrigido(respCorrecaoTituloData.texto_corrigido);
          setCorrecaoTipo('titulo');
          setVisibilidadePopupCorrecao(true);
          return false;
        }


        const respCorrecaoDescricao = await iaService.corrigir(registro.descricao);
        const respCorrecaoDescricaoData = respCorrecaoDescricao.data;
        if (!respCorrecaoDescricaoData.valido) {
          setCorrecaoTextoCorrigido(respCorrecaoDescricaoData.texto_corrigido);
          setCorrecaoTipo('descricao');
          setVisibilidadePopupCorrecao(true);
          return false;
        }

        // registro
        const {data} = await registroService.salvar(registro);


        // imagens
        for (const imagem of imagens) {
          if (!imagem) continue;

          const formData = new FormData();
          formData.append('file', imagem);
          formData.append('idRegistro', data.id);

          try {
            await imagemService.salvar(formData);
            console.log('Imagem cadastrada com sucesso!');
          } catch (error) {
            mensagemErro(error?.response?.data?.descricao ?? 'Erro ao cadastrar imagem');
            await registroService.deletar(data.id);
            throw error;
          }
        }

        mensagemSucesso(registroRecebido ? 'Registro editado com sucesso!' : 'Registro cadastrado com sucesso!');
        navigate('/')
      } catch (error) {
        mensagemErro(error?.response?.data?.descricao ?? 'Erro ao cadastrar registro');
      } finally {
        setIsLoading(false);
      }
    } else {
      mensagemErro('Você deve concordar com as regras de uso para cadastrar um registro.')
    }
  };

  /**
   * Aceitar a correção da IA
   */
  const aceitarCorrecao = () => {
    const correcaoTextoCorrigidoTratado = correcaoTextoCorrigido.replaceAll('<correcao>', '').replaceAll('</correcao>', '');
    if (correcaoTipo === 'titulo') {
      setRegistro({...registro, titulo: correcaoTextoCorrigidoTratado});
    }
    if (correcaoTipo === 'descricao') {
      setRegistro({...registro, descricao: correcaoTextoCorrigidoTratado});
    }
    setVisibilidadePopupCorrecao(false);
  }

  /**
   * Abre o popup de remoção de imagem e define o índice da imagem a ser removida
   * @param imagemIdx índice da imagem a ser removida
   */
  const handleRemoverImagem = (imagemIdx) => {
    setVisibilidadePopupRemocao(true);
    setImagemIdxParaRemover(imagemIdx);
  }

  /**
   * Remove a imagem do registro
   */
  const removerImagem = () => {
    setVisibilidadePopupRemocao(false);

    imagemService
      .remover(registro.imagens[imagemIdxParaRemover].id)
      .then(response => {
        setRegistro({
          ...registro,
          imagens: registro.imagens.filter((_, index) => index !== imagemIdxParaRemover)
        });
        mensagemSucesso("Imagem removida com sucesso!");
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao remover imagem');
    });

  }

  const preencherRegitroDev = () => {
    setRegistro({
      titulo: 'Buraco na rua',
      descricao: 'Há um buraco grande na rua que está causando problemas para os motoristas e pedestres.',
      latitude: -27.57841321989771,
      longitude: -48.538419398201704,
      bairro: 'Agronômica',
      localizacao: 'Agronômica',
      categoria: categorias[0],
      imagens: []
    });
    setIconeCategoriaSelecionada(categorias[0].icone);
    setCheckRegras(true)
  }

  return (
    <div className='container'>

      {/* ---------------------- popup com as correções de IA ---------------------- */}
      <PopupCorrecao
        visivel={visibilidadePopupCorrecao}
        tipo={correcaoTipo}
        textoCorrigido={correcaoTextoCorrigido}
        abrirRegrasPublicacao={() => setVisibilidadePopupRegras(true)}
        onAceitar={aceitarCorrecao}
        onRejeitar={() => setVisibilidadePopupCorrecao(false)}
      />

      {/* ---------------------- popup com as regras de publicação ---------------------- */}
      <PopupSimples
        visivel={visibilidadePopupRegras}
        titulo="Regras de Publicação"
        mensagem="
            <ul>
              <li><strong>Sem palavrões ou linguagem ofensiva:</strong> O uso de xingamentos, palavras de baixo calão ou expressões agressivas não será permitido.</li>
              <li><strong>Sem discurso de ódio:</strong> Não são aceitos textos que incentivem ou promovam preconceito, discriminação ou violência contra qualquer grupo ou indivíduo.</li>
              <li><strong>Sem conteúdo explícito ou inapropriado:</strong> Qualquer menção a temas de natureza sexual explícita, violência gráfica ou conteúdo impróprio será removida.</li>
              <li><strong>Sem calúnia ou difamação:</strong> O usuário não pode acusar terceiros sem provas, fazer alegações falsas ou prejudicar a reputação de pessoas ou instituições.</li>
              <li><strong>Sem spam ou autopromoção:</strong> O sistema não deve ser usado para publicidade, propagandas ou autopromoção de produtos e serviços.</li>
            </ul>
        "
        fechar={() => setVisibilidadePopupRegras(false)}
      />

      {/* ---------------------- popup de confirmação de remoção de imagem ---------------------- */}
      <PopupConfirmacao
        visivel={visibilidadePopupRemocao}
        titulo="Remover Imagem"
        mensagem="Tem certeza que deseja remover a imagem? Não é possível desfazer esta ação."
        onConfirm={removerImagem}
        onCancel={() => setVisibilidadePopupRemocao(false)}
      />

      {/* ---------------------- titulo ---------------------- */}
      <div className="row mt-3">
        <div className="col-12 d-flex ">
          <h2>Crie um novo registro</h2> <a onClick={preencherRegitroDev} className='text-white'>dev</a>
        </div>
      </div>


      <div className="row mb-5 flex-row-reverse flex-lg-row">

        {/* ---------------------- formulário ---------------------- */}
        <div className="col-lg-6 mt-3">
          <Form>

            {/*localizacao*/}
            <Form.Group className="mb-3">
              <Form.Label>Localização*</Form.Label>
              <InputEndereco
                registro={registro}
                setRegistro={setRegistro}
              />
            </Form.Group>

            {/*titulo e categoria*/}
            <div className='row mb-3'>

              {/*titulo*/}
              <Form.Group className="col-md-6">
                <Form.Label>Título*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o título"
                  value={registro.titulo}
                  onChange={event => setRegistro({...registro, titulo: event.target.value})}/>
              </Form.Group>

              {/*categoria*/}
              <Form.Group className="col-md-6">
                <Form.Label>Categoria*</Form.Label>
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
              <Form.Label>Descrição*</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Descreva o problema em detalhes"
                rows={4}
                value={registro.descricao}
                onChange={event => setRegistro({...registro, descricao: event.target.value})}/>
            </Form.Group>

            {/* -------------------- imagens ----------------- */}
            <Form.Group className="mb-3">
              <Form.Label>Imagens</Form.Label>
              <div className="row d-flex gap-1 px-2">

                {registro.imagens[0] ?
                  <BlocoImagem imagem={registro.imagens[0].caminho} onClick={() => handleRemoverImagem(0)}/> :
                  <Form.Control
                    type="file"
                    onChange={event => {
                      setImagens([event.target.files[0], imagens[1], imagens[2]]);
                    }}/>
                }

                {registro.imagens[1] ?
                  <BlocoImagem imagem={registro.imagens[1].caminho} onClick={() => handleRemoverImagem(1)}/> :
                  <Form.Control
                    type="file"
                    onChange={event => {
                      setImagens([imagens[0], event.target.files[0], imagens[2]]);
                    }}/>
                }

                {registro.imagens[2] ?
                  <BlocoImagem imagem={registro.imagens[2].caminho} onClick={() => handleRemoverImagem(2)}/> :
                  <Form.Control
                    type="file"
                    onChange={event => {
                      setImagens([imagens[0], imagens[1], event.target.files[0]]);
                    }}/>
                }


              </div>
            </Form.Group>


          </Form>
        </div>


        {/* ---------------------- mapa ---------------------- */}
        <div className="col-lg-6 mt-3">
          <Form.Label>{registro.bairro ? 'Bairro selecionado: ' + registro.bairro : 'Clique no mapa para inserir um marcador ou use o campo Localização'}</Form.Label>
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

          {/*botões*/}
          <div className="mt-3 d-flex justify-content-end gap-2">

            {/*check de regras*/}
            <div className='rounded border border-1 border-dark-subtle p-2 d-flex gap-2'>
              <Form.Check
                type='checkbox'
                onChange={event => setCheckRegras(event.target.checked)}
              />
              <span>Li e concordo com as <a className='clicavel' onClick={() => setVisibilidadePopupRegras(true)}>regras de publicação</a></span>
            </div>

            {/*botão de cadastro*/}
            {
              isLoading ? (
                // versão com spinner
                <Button variant="warning" disabled className="d-flex gap-2 align-items-center">
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                  <div> {registroRecebido ? 'Editando' : 'Cadastrando'}</div>
                </Button>
              ) : (
                // versão sem spinner
                <Button variant="warning" onClick={cadastrar}>
                  {registroRecebido ? 'Editar' : 'Cadastrar'}
                </Button>
              )
            }
          </div>

        </div>


      </div>
    </div>
  )
}
