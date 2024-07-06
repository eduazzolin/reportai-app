export async function consultar() {
  return [
    {
      "id": 1,
      "titulo": "Buraco na rua",
      "descricao": "Tem um buraco na rua da minha casa, já faz 1 semana que está aberto e com a chuva piorou. Precisamos de uma solução urgente.",
      "localizacao": "Na frente dos Bombeiros na Trindade",
      "latitude": -27.5884,
      "longitude": -48.5229,
      "dt_criacao": "2021-10-01T10:00:00",
      "dt_modificacao": "2021-10-02T10:00:00",
      "is_concluido": false,
      "categoria": {
        "id": 1,
        "nome": "Buraco na rua",
        "icone": "/markers/street.png"
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
        "icone": "/markers/light.png"
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
        "icone": "/markers/tree.png"
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