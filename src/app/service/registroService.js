import ApiService from "./apiService";
import {categoriaPrototype} from "./categoriaService";
import {COORDENADAS_CENTRO} from "./appService";
import ErroValidacao from "../exception/erroValidacao";

export class RegistroService extends ApiService {
  constructor() {
    super('/registros');
  }

  /**
   * Busca todos os registros com os parâmetros de filtro. Utilziado na tela Admin.
   *
   * @param idNome ID ou titulo do registro
   * @param idUsuario ID do usuário
   * @param idCategoria ID da categoria
   * @param bairro Bairro do registro
   * @param status Status do registro: ATIVO, CONCLUIDO
   * @param pagina Número da página
   * @param limite Número de registros por página
   * @param ordenacao Campo de ordenação
   * @returns RegistrosAdminPaginadoDTO
   */
  buscarTodos(idNome, idUsuario, idCategoria, bairro, status, pagina, limite, ordenacao) {
    const p_idNome = `idNome=${idNome || ''}`;
    const p_idUsuario = `idUsuario=${idUsuario || 0}`;
    const p_idCategoria = `idCategoria=${idCategoria || 0}`;
    const p_bairro = `bairro=${bairro || ''}`;
    const p_status = `status=${status || ''}`;
    const p_pagina = `pagina=${pagina || 0}`;
    const p_limite = `limite=${limite || 10}`;
    const p_ordenacao = `ordenacao=${ordenacao || 'dtCriacao'}`;

    const url = `/admin?${p_idNome}&${p_idUsuario}&${p_idCategoria}&${p_bairro}&${p_status}&${p_pagina}&${p_limite}&${p_ordenacao}`;
    return this.get(url);
  }

  /**
   * Busca todos os registros do usuário requisitante.
   *
   * @param pagina Número da página
   * @param limite Número de registros por página
   * @returns meusRegistrosDTO
   */
  consultarMeusRegistros(pagina, limite) {
    return this.get(`/meus-registros?pagina=${pagina}&limite=${limite}`);
  }

  /**
   * Busca o registro pelo ID.
   *
   * @param id ID do registro
   * @returns Registro
   */
  consultarPorId(id) {
    return this.get(`/${id}`);
  }

  /**
   * Busca os registros baseado na localização e em filtros. Utilizado na tela home.
   * O limite de registros está no back e é de 100 registros (27-04-2025).
   *
   * @param latitude latidude de referência
   * @param longitude longitude de referência
   * @param distancia distância em km máxima da referência. calculado a partir do zoom na tela home.
   * @param filtro filtro de busca
   * @param ordenacao campo de ordenação
   * @returns List<registroDTO>
   */
  consultar(latitude, longitude, distancia, filtro, ordenacao) {
    const p_lat = `latitude=${latitude}`;
    const p_long = `longitude=${longitude}`;
    const p_dist = `distancia=${distancia}`;
    const p_filtro = `filtro=${filtro || 'AND 0=0'}`;
    const p_ordenacao = `ordenacao=${ordenacao || 'dt_criacao DESC'}`;

    const url = `/distancia?${p_lat}&${p_long}&${p_dist}&${p_filtro}&${p_ordenacao}`;
    return this.get(url);
  }

  /**
   * Calcula a distância do registro até o centro da cidade. Utilizado para validar o registro.
   *
   * @param lat latitude
   * @param lon longitude
   * @returns {number} distância em km
   */
  calcularDistanciaDoCentro(lat, lon) {
    const diferencaLat = COORDENADAS_CENTRO[0] - lat;
    const diferencaLong = COORDENADAS_CENTRO[1] - lon;
    return Math.sqrt(Math.pow(diferencaLat, 2) + Math.pow(diferencaLong, 2)) * 100;
  }

  /**
   * Salva um registro no banco de dados.
   *
   * @param registro Objeto do registro a ser salvo
   * @returns registroDTO
   */
  salvar(registro) {
    return this.post('', registro);
  }

  /**
   * Bateria de validações para o registro.
   *
   * @param registro
   * @throws ErroValidacao
   */
  validar(registro) {
    const erros = []

    // localização
    if (!registro.localizacao) {
      erros.push("O campo localização é obrigatório.")
    } else if (registro.localizacao.length > 512) {
      erros.push("O campo localização deve ter no máximo 512 caracteres.")
    }

    // titulo
    if (!registro.titulo) {
      erros.push("O campo título é obrigatório.")
    } else if (registro.titulo.length > 255) {
      erros.push("O campo título deve ter no máximo 255 caracteres.")
    }

    // descrição
    if (!registro.descricao) {
      erros.push("O campo descrição é obrigatório.")
    } else if (registro.descricao.length > 3500) {
      erros.push("O campo descrição deve ter no máximo 3500 caracteres.")
    }

    // categoria
    if (!registro.categoria || !registro.categoria.id) {
      erros.push("O campo categoria é obrigatório.")
    }

    // latitude e longitude
    if (!registro.latitude || !registro.longitude) {
      erros.push("Selecione a localização do registro no mapa.")
    } else if (this.calcularDistanciaDoCentro(registro.latitude, registro.longitude) > 30) {
      erros.push("O local do registro deve estar a menos de 30 km do centro.")
    }

    // lançando erros
    if (erros && erros.length > 0) {
      throw new ErroValidacao(erros);
    }

  }

  /**
   * Remove um registro, marca como is_deleted.
   *
   * @param id ID do registro
   * @returns Status 200
   */
  deletar(id) {
    return this.delete(`/${id}`);
  }

  /**
   * Marca um registro como concluído.
   *
   * @param id ID do registro
   * @returns Status 200
   */
  concluir(id) {
    return this.put(`/${id}/concluir`);
  }

  /**
   * Ignora a conclusão programada do registro.
   *
   * @param id ID do registro
   * @returns Status 200
   */
  ignorarConclusao(id) {
    return this.put(`/${id}/ignorar-conclusao`);
  }

}


export const registroPrototype = {
  "id": null,
  "titulo": "",
  "descricao": "",
  "bairro": "",
  "localizacao": "",
  "latitude": null,
  "longitude": null,
  "dtCriacao": null,
  "dtModificacao": null,
  "isConcluido": false,
  "isDeleted": false,
  "categoria": categoriaPrototype,
  "imagens": [],
  "usuario": {
    "id": null, "nome": ""
  },
  "interacoesRelevante": 0,
  "interacoesConcluido": 0
}


export const ORDENACOES_PERMITIDAS = [
  {value: 'R.dt_criacao DESC', label: 'Mais recentes'},
  {value: 'R.dt_criacao ASC', label: 'Mais antigos'},
  {value: 'I.interacoesRelevante DESC', label: 'Mais relevantes'},
  {value: 'I.interacoesRelevante ASC', label: 'Menos relevantes'},
  {value: 'R.distancia_do_centro ASC', label: 'Mais próximos do centro do mapa'},
  {value: 'R.distancia_do_centro DESC', label: 'Mais distantes do centro do mapa'}
]