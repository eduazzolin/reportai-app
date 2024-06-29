export async function consultar() {
  return [{
    "id": 1,
    "titulo": "Buraco na rua",
    "descricao": "Tem um buraco na rua da minha casa, já faz 1 semana que está aberto e com a chuva piorou. Precisamos de uma solução urgente.",
    "icone": "pi pi-map-marker",
    "latitude": -23.588068,
    "longitude": -46.632689,
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
      icone: "pi pi-lightbulb",
      latitude: -23.550520,
      longitude: -46.633308,
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
      icone: "pi pi-tree",
      latitude: -23.561682,
      longitude: -46.655381,
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
    },
    {
      id: 4,
      titulo: "Vazamento de água",
      descricao: "Existe um vazamento de água na calçada em frente ao meu prédio. A água está escorrendo pela rua e desperdiçando muito.",
      icone: "pi pi-water",
      latitude: -23.565689,
      longitude: -46.651731,
      dt_criacao: "2022-01-05T09:00:00",
      is_concluido: false,
      usuario: {
        id: 4,
        nome: "Ana Paula",
        email: "ana@email.com"
      },
      imagens: [
        {
          id: 8,
          nome: "vazamento1.jpg",
          url: "./imagens/vazamento1.jpg"
        },
        {
          id: 9,
          nome: "vazamento2.jpg",
          url: "./imagens/vazamento2.jpg"
        }
      ],
      interacao_likes: 5,
      interacao_concluido: 2,
    },
    {
      id: 5,
      titulo: "Sinal de trânsito quebrado",
      descricao: "O sinal de trânsito na esquina da Av. Paulista com a Rua da Consolação está quebrado. Isso está causando muitos transtornos no tráfego.",
      icone: "pi pi-stop",
      latitude: -23.556735,
      longitude: -46.658463,
      dt_criacao: "2022-02-10T16:45:00",
      is_concluido: true,
      usuario: {
        id: 5,
        nome: "Roberto Lima",
        email: "roberto@email.com"
      },
      imagens: [
        {
          id: 10,
          nome: "sinal1.jpg",
          url: "./imagens/sinal1.jpg"
        }
      ],
      interacao_likes: 25,
      interacao_concluido: 10,
    }
  ];
}