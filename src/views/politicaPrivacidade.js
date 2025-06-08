import React, {useEffect} from 'react';
import politicaPrivacidade from "../resources/politica_privacidade";

export default function PoliticaPrivacidade() {

  useEffect(() => {
    document.title = `Reportaí - Política de Privacidade`;
  }, []);


  return (
    <div className='container p-4'>
      {
        <div dangerouslySetInnerHTML={{ __html: politicaPrivacidade }} />
      }
    </div>
  );
}
