export async function consultar() {
  return [
    {
      "id": 1,
      "titulo": "Buraco na rua",
      "descricao": "A rua onde moro está enfrentando um problema sério há uma semana. Um grande buraco se formou no meio da via, trazendo inúmeros transtornos para os moradores e motoristas que passam pelo local. Este buraco não só representa um obstáculo físico, mas também um risco significativo para a segurança de todos que trafegam pela área.\n\nNos últimos dias, a situação se agravou devido às fortes chuvas que atingiram a região. A água da chuva ampliou o tamanho do buraco e tornou a via ainda mais perigosa. O buraco está ficando mais profundo e largo, aumentando as chances de acidentes. Além disso, a água acumulada dentro do buraco pode causar danos adicionais à infraestrutura da rua e aos veículos que, inadvertidamente, passem por ali.\n\nÉ urgente que medidas sejam tomadas para resolver este problema. Os moradores da rua estão preocupados e apelam para as autoridades responsáveis para que realizem os reparos necessários o mais rápido possível. Uma solução imediata é essencial para garantir a segurança dos pedestres, ciclistas e motoristas, além de evitar que o problema se torne ainda mais grave.\n\nA presença deste buraco já está afetando a rotina diária de todos que vivem e transitam pela região. É imperativo que as autoridades municipais priorizem este reparo e implementem uma solução duradoura para evitar futuros transtornos. A comunidade local espera uma resposta rápida e eficaz para este problema que, embora pareça simples, tem grandes repercussões na vida cotidiana de muitas pessoas.",
      "localizacao": "Na frente dos Bombeiros na Trindade",
      "latitude": -27.5884,
      "longitude": -48.5229,
      "dt_criacao": "2021-10-01T10:00:00",
      "dt_modificacao": "2021-10-02T10:00:00",
      "is_concluido": false,
      "categoria": {
        "id": 1,
        "nome": "Buraco na rua",
        "icone": "/markers/street.svg"
      },
      "usuario": {
        "id": 1,
        "nome": "João da Silva",
        "email": "joao@email.com",
        "foto": "/fotos/joao.jpg"
      },
      "imagens": [
        {
          "id": 1,
          "nome": "buraco1.jpg",
          "caminho": "/fotos/buraco1.jpg"
        },
        {
          "id": 2,
          "nome": "buraco2.jpg",
          "caminho": "/fotos/buraco2.jpg"
        },
        {
          "id": 3,
          "nome": "buraco3.jpg",
          "caminho": "/fotos/buraco3.jpg"
        }
      ],
      "interacao_likes": [
        {"id": 1, "id_usuario": 2},
        {"id": 2, "id_usuario": 3}
      ],
      "interacao_concluido": [
        {"id": 1, "id_usuario": 4}
      ]
    },
    {
      "id": 2,
      "titulo": "Lâmpada queimada",
      "descricao": "A lâmpada do poste na esquina da minha rua está queimada há mais de 2 semanas. A rua fica muito escura e perigosa.",
      "localizacao": "Esquina da Rua das Flores com a Rua das Palmeiras",
      "latitude": -27.5777,
      "longitude": -48.5314,
      "dt_criacao": "2021-11-01T12:00:00",
      "dt_modificacao": "2021-11-03T12:00:00",
      "is_concluido": false,
      "categoria": {
        "id": 2,
        "nome": "Lâmpada queimada",
        "icone": "/markers/light.svg"
      },
      "usuario": {
        "id": 2,
        "nome": "Maria Oliveira",
        "email": "maria@email.com",
        "foto": "/fotos/maria.jpg"
      },
      "imagens": [
        {
          "id": 4,
          "nome": "poste1.jpg",
          "caminho": "/fotos/poste1.jpg"
        },
        {
          "id": 5,
          "nome": "poste2.jpg",
          "caminho": "/fotos/poste2.jpg"
        }
      ],
      "interacao_likes": [
        {"id": 3, "id_usuario": 1},
        {"id": 4, "id_usuario": 3}
      ],
      "interacao_concluido": [
        {"id": 2, "id_usuario": 4}
      ]
    },
    {
      "id": 3,
      "titulo": "Árvore caída",
      "descricao": "Uma árvore caiu no parque da cidade após a tempestade de ontem. Está bloqueando a pista de corrida.",
      "localizacao": "Praça Getúlio Vargas",
      "latitude": -27.5936,
      "longitude": -48.5470,
      "dt_criacao": "2021-12-15T14:30:00",
      "dt_modificacao": "2021-12-16T14:30:00",
      "is_concluido": false,
      "categoria": {
        "id": 3,
        "nome": "Árvore caída",
        "icone": "/markers/tree.svg"
      },
      "usuario": {
        "id": 3,
        "nome": "Carlos Souza",
        "email": "carlos@email.com",
        "foto": "/fotos/carlos.jpg"
      },
      "imagens": [
        {
          "id": 6,
          "nome": "arvore1.jpg",
          "caminho": "/fotos/arvore1.jpg"
        },
        {
          "id": 7,
          "nome": "arvore2.jpg",
          "caminho": "/fotos/arvore2.jpg"
        }
      ],
      "interacao_likes": [
        {"id": 5, "id_usuario": 1},
        {"id": 6, "id_usuario": 2}
      ],
      "interacao_concluido": [
        {"id": 3, "id_usuario": 4}
      ]
    }
  ];
}

export async function consultarPorId(id) {
  const lista = await consultar();
  return lista.find(registro => registro.id == id);
}

export const registroPrototype = {
  "id": 0,
  "titulo": "",
  "descricao": "",
  "localizacao": "",
  "latitude": 0,
  "longitude": 0,
  "dt_criacao": "",
  "dt_modificacao": "",
  "is_concluido": false,
  "categoria": {
    "id": 0,
    "nome": "",
    "icone": ""
  },
  "usuario": {
    "id": 0,
    "nome": "",
    "email": "",
    "foto": ""
  },
  "imagens": [],
  "interacao_likes": [],
  "interacao_concluido": []
};