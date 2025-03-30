import ApiService from "./apiService";
import {categoriaPrototype} from "./categoriaService";
import {COORDENADAS_CENTRO} from "./appService";
import ErroValidacao from "../exception/erroValidacao";

export class RegistroService extends ApiService {
  constructor() {
    super('/registros');
  }

  consultar(latitude, longitude, distancia, filtro, ordenacao) {
    const p_lat = `latitude=${latitude}`;
    const p_long = `longitude=${longitude}`;
    const p_dist = `distancia=${distancia}`;
    const p_filtro = `filtro=${filtro || 'AND 0=0'}`;
    const p_ordenacao = `ordenacao=${ordenacao || 'dt_criacao DESC'}`;

    const url = `/distancia?${p_lat}&${p_long}&${p_dist}&${p_filtro}&${p_ordenacao}`;
    return this.get(url);
  }

  calcularDistanciaDoCentro(lat, lon) {
    const diferencaLat = COORDENADAS_CENTRO[0] - lat;
    const diferencaLong = COORDENADAS_CENTRO[1] - lon;
    return Math.sqrt(Math.pow(diferencaLat, 2) + Math.pow(diferencaLong, 2)) * 100;
  }

  salvar(registro) {
    return this.post('', registro);
  }

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

  deletar(id) {
    return this.delete(`/${id}`);
  }
}

export const registroPrototype = {
  "id": null,
  "titulo": "",
  "descricao": "",
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
    "id": null,
    "nome": ""
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
  {value: 'R.distancia_do_centro DESC', label: 'Mais distantes do centro do mapa'},
]