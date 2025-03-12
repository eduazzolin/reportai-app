export function formatarDataHora(data) {
  return new Date(data).toLocaleString();
}

export function formatarDescricao(descricao) {
  return descricao.split('\n').map((item, key) => {
    return <p key={key}>{item}</p>
  });
}

export const COORDENADAS_CENTRO = [-27.596674, -48.5466487]