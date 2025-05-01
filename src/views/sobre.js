import React, {useEffect} from 'react';


export default function Sobre() {

  useEffect(() => {
    document.title = `Reportaí - Sobre`;
  }, []);


  return (
    <div className='container p-4'>
      <div className="row mt-3">
        <div className="col-lg-6 p-3">
          <div className="p-3">
            <img src="logo.png" alt="" className='img-fluid'/>
          </div>
          <div className='sobre mt-3 texto_justificado'>
            <strong>Reportaí</strong> é uma plataforma pensada para permitir que os cidadãos criem e interajam com marcadores no mapa da cidade, reportando problemas urbanos como buracos nas ruas, semáforos defeituosos, acúmulo de lixo e falta de acessibilidade. Com
            recursos de interação social, como marcações de relevância e votos de resolução, o sistema facilita a comunicação entre a população e o poder público, aumentando a visibilidade das questões e promovendo soluções eficazes para melhorar a comunidade.
          </div>
        </div>
        <div className="col-lg-6 p-3">
          <img src="poster.png" alt="" className='img-fluid'/>

        </div>


      </div>
    </div>
  );
}
