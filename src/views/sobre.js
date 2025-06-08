import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";


export default function Sobre() {

  useEffect(() => {
    document.title = `Reportaí - Sobre`;
  }, []);

  const navigate = useNavigate();

  return (
    <div className='container p-4'>
      <div className="row mt-3">
        <div className="col-lg-7 p-3 d-flex flex-column mx-auto ">

          <img src="https://storage.googleapis.com/reportai/resources/logo.png" alt="" className='img-fluid mx-auto' style={{maxWidth: '200px'}}/>

          <div className='mt-3 texto_justificado'>
            <strong>Reportaí</strong> é uma plataforma pensada para permitir que os cidadãos criem e interajam com marcadores no mapa da cidade, reportando problemas urbanos como buracos nas ruas, semáforos defeituosos, acúmulo de lixo e falta de
            acessibilidade. Com
            recursos de interação social, como marcações de relevância e votos de resolução, o sistema facilita a comunicação entre a população e o poder público, aumentando a visibilidade das questões e promovendo soluções eficazes para melhorar a
            comunidade.
          </div>
          <a className='clicavel mt-3' href={'mailto:reportai34@gmail.com'}>Fale conosco</a>
          <a className='clicavel mt-1' onClick={() => navigate('/politica-privacidade')}>Política de privacidade</a>
          <hr className='mt-3 mb-3'/>

          <img src="https://storage.googleapis.com/reportai/resources/poster_wide.jpg" alt="" className='img-fluid mx-auto mt-3 mb-2'/>



          <div className='texto_justificado mt-3'>
            O Reportaí foi desenvolvido como parte do Trabalho de Conclusão de Semestre (TCS) do curso de <strong>Análise e Desenvolvimento de Sistemas do Senac - Florianópolis</strong>, no primeiro semestre de 2025. O projeto foi Desenvolvido
            por <strong> Eduardo Soares Azzolin</strong>, sob a orientação dos professores André Ulisses da Silva, Fabian Luiz Mendonça Souza, Kaio Takeshi Arakawa dos Santos, Luciano José Kogut, Myaghy Augusto Pires Miranda, Sidney da Silva Andrade
            e Thayse Chistine da Silva. A idealização do Projeto também contou com a colaboração do ex-colega e amigo Guilherme Caon.
          </div>
          <div className='texto_justificado mt-3 fst-italic'>
            Junho de 2025, Florianópolis - SC, Brasil.
          </div>

        </div>
      </div>
    </div>
  );
}
