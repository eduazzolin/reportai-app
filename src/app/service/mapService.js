/**
 * Função para obter o nome do bairro e a localização a partir de coordenadas de latitude e longitude.
 *
 * @param lat latitude
 * @param lng longitude
 * @returns [bairro, localizacao]
 */
export const obterBairroLocalizacaoPorLatLong = async (lat, lng) => {
  // https://nominatim.org/release-docs/develop/api/Reverse/
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
    const data = await response.json();
    const bairro = data.address?.neighbourhood || data.address?.suburb || data.address?.quarter || 'Outros bairros'
    const localizacao = data.display_name || '';
    return [bairro, localizacao];
  } catch (error) {
    console.error('Erro ao obter nome do bairro:', error);
    return ['Outros bairros', ''];
  }
};
