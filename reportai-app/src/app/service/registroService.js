export async function consultar() {
  return [
    {
      "id": 1,
      "titulo": "Buraco na rua",
      "descricao": "Tem um buraco na rua da minha casa, já faz 1 semana que está aberto e com a chuva piorou. Precisamos de uma solução urgente.",
      "icone": "street",
      "localizacao": "Na frente dos Bombeiros na Trindade",
      "latitude": -27.5884,
      "longitude": -48.5229,
      "dt_criacao": "2021-10-01T10:00:00",
      "is_concluido": false,
      "usuario": {
        "id": 1,
        "nome": "João da Silva",
        "email": "joao@email.com"
      },
      "imagens": [
        {
          "id": 1,
          "nome": "buraco1.jpg",
          "url": "./imagens/buraco1.jpg"
        },
        {
          "id": 2,
          "nome": "buraco2.jpg",
          "url": "./imagens/buraco2.jpg"
        },
        {
          "id": 3,
          "nome": "buraco3.jpg",
          "url": "./imagens/buraco3.jpg"
        }
      ],
      "interacao_likes": 10,
      "interacao_concluido": 5,
    },
    {
      id: 2,
      titulo: "Lâmpada queimada",
      descricao: "A lâmpada do poste na esquina da minha rua está queimada há mais de 2 semanas. A rua fica muito escura e perigosa.",
      icone: "light",
      localizacao: "Esquina da Rua das Flores com a Rua das Palmeiras",
      latitude: -27.5777,
      longitude: -48.5314,
      dt_criacao: "2021-11-01T12:00:00",
      is_concluido: false,
      usuario: {
        id: 2,
        nome: "Maria Oliveira",
        email: "maria@email.com"
      },
      imagens: [
        {
          id: 4,
          nome: "lampada1.jpg",
          url: "./imagens/lampada1.jpg"
        },
        {
          id: 5,
          nome: "lampada2.jpg",
          url: "./imagens/lampada2.jpg"
        }
      ],
      interacao_likes: 15,
      interacao_concluido: 3,
    },
    {
      id: 3,
      titulo: "Árvore caída",
      descricao: "Uma árvore caiu no parque da cidade após a tempestade de ontem. Está bloqueando a pista de corrida.",
      icone: "tree",
      localizacao: "Praça Getúlio Vargas",
      latitude: -27.5936,
      longitude: -48.5470,
      dt_criacao: "2021-12-15T14:30:00",
      is_concluido: false,
      usuario: {
        id: 3,
        nome: "Carlos Souza",
        email: "carlos@email.com"
      },
      imagens: [
        {
          id: 6,
          nome: "arvore1.jpg",
          url: "./imagens/arvore1.jpg"
        },
        {
          id: 7,
          nome: "arvore2.jpg",
          url: "./imagens/arvore2.jpg"
        }
      ],
      interacao_likes: 20,
      interacao_concluido: 7,
    }
  ];
}