import React from 'react';
import './cardRegistroMeusRegistros.css'
import {BsCheckSquareFill, BsFillXSquareFill} from "react-icons/bs";
import IconeCrud from "../iconeCrud/iconeCrud";
import {MdEditSquare, MdHelpCenter} from "react-icons/md";
import TextConcluido from "../textConcluido/textConcluido";
import {useNavigate} from "react-router-dom";
import TextConclusaoProgramada from "../textConclusaoProgramada/textConclusaoProgramada";
import {FaCalendarXmark} from "react-icons/fa6";
import IconeCrudSemTexto from "../iconeCrudSemTexto/iconeCrudSemTexto";

export default function CardRegistroMeusRegistros({registro, funcaoRemover, funcaoConcluir, funcaoIgnorarConclusao}) {

  const navigate = useNavigate();

  const goToRegistro = () => {
    window.open(`/registro/${registro.id}`, '_blank');
  };

  const handleEditarRegistro = () => {
    navigate('/cadastrar-registro', {state: {registro}});
  }

  return (

    <div className={"container bg-light border rounded shadow-sm"}>


      <div className="row p-2 overflow-hidden">

        {/* ---------------------- imagens ---------------------- */}
        <div className="col-4 p-0 ">
          <div>
            {registro.imagens[0]?.caminho ? (
              <img src={registro.imagens[0].caminho} className="mr_img_thumb  rounded clicavel border" onClick={goToRegistro} alt="..."/>
            ) : (
              <img src="/placeholder_registro.png" className="mr_img_thumb  rounded clicavel border" onClick={goToRegistro} alt="..."/>
            )}
          </div>
        </div>

        {/* ---------------------- texto ---------------------- */}
        <div className="col-8 ps-3">

          {/*titulo e localização*/}
          <div className="row">

            {/*cabeçalho*/}
            <div onClick={goToRegistro} className="col-12 d-flex mb-3 mt-2 gap-2 clicavel div_titulo   overflow-hidden ">

              {/*icone*/}
              <img src={registro.categoria.icone} className="clicavel mr_img_localizacao flex-shrink-0" alt="..."/>

              {/*titulo e localização*/}
              <div>
                <h5 className={"mb-0 text-nowrap text-truncate"}>{registro.titulo}</h5>
                <div className={"mr_text_localizacao text-nowrap text-truncate"}>{registro.localizacao}</div>
              </div>

            </div>
          </div>

          {/*descrição*/}
          <div className="row mr_div_descricao">
            <p className={"mr_text_descricao"}>{registro.descricao}</p>
          </div>

        </div>
      </div>

      {/* ---------------------- botões ---------------------- */}
      {/*https://react-icons.github.io/react-icons/*/}

      {
        registro.isConcluido ?

          // -------> registros concluídos
          <div className="row pb-2">
            <div className="col-12 d-flex align-items-center justify-content-between gap-2">

              <div className="flex-grow-1">
                <TextConcluido data={registro.dtConclusao}/>
              </div>

              <IconeCrud
                icone={BsFillXSquareFill}
                texto={'Remover'}
                cor={'rgba(243,93,63,0.82)'}
                funcao={() => funcaoRemover(registro.id)}
              />
            </div>
          </div>

          :

          registro.dtConclusaoProgramada ?

            // -------> registros com conclusão programada
            <div className="row pb-2">
              <div className="col-12">
              </div>
              <div className="col-12 d-flex align-items-center justify-content-between gap-2 ">

                <TextConclusaoProgramada data={registro.dtConclusaoProgramada}/>

                <IconeCrudSemTexto
                  icone={MdHelpCenter}
                  size='25px'
                  tooltip='Quando alguém marca seu registro como concluído, você tem 30 dias para confirmar a conclusão ou ignorá-la.'
                />

                <IconeCrud
                  icone={FaCalendarXmark}
                  texto={'Ignorar'}
                  cor={'rgba(0,53,151,0.82)'}
                  funcao={() => funcaoIgnorarConclusao(registro.id)}
                />

                <IconeCrud
                  icone={BsCheckSquareFill}
                  texto={'Concluir'}
                  cor={'rgba(39,151,0,0.82)'}
                  funcao={() => funcaoConcluir(registro.id)}
                />


              </div>
            </div>

            :

            // -------> registros ativos sem conclusão programada
            <div className="row pb-2">
              <div className="col-12 d-flex align-items-center justify-content-between  gap-2 ">
                <IconeCrud
                  icone={MdEditSquare}
                  texto={'Editar'}
                  cor={'#bf9600'}
                  funcao={handleEditarRegistro}
                />
                <IconeCrud
                  icone={BsFillXSquareFill}
                  texto={'Remover'}
                  cor={'rgba(211,49,14,0.82)'}
                  funcao={() => funcaoRemover(registro.id)}
                />
                <IconeCrud
                  icone={BsCheckSquareFill}
                  texto={'Concluir'}
                  cor={'rgba(39,151,0,0.82)'}
                  funcao={() => funcaoConcluir(registro.id)}
                />
              </div>
            </div>

      }

    </div>)
}