import React, {useEffect} from 'react';
import {RegistroService} from "../app/service/registroService";
import Form from "react-bootstrap/Form";


export default function RelatoriosPublicos() {
  const hoje = new Date();

  const periodos = [
    {
      value: "Todos os registros",
      dataInicio: null,
      dataFim: null
    },
    {
      value: "Mês atual",
      dataInicio: new Date(hoje.getFullYear(), hoje.getMonth(), 1),
      dataFim: hoje
    },
    {
      value: "Últimos 30 dias",
      dataInicio: new Date(new Date().setDate(hoje.getDate() - 30)),
      dataFim: hoje
    },
    {
      value: "Mês anterior",
      dataInicio: new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1),
      dataFim: new Date(hoje.getFullYear(), hoje.getMonth(), 0)
    },
    {
      value: "Últimos 60 dias",
      dataInicio: new Date(new Date().setDate(hoje.getDate() - 60)),
      dataFim: hoje
    },
    {
      value: "Últimos 90 dias",
      dataInicio: new Date(new Date().setDate(hoje.getDate() - 90)),
      dataFim: hoje
    },
    {
      value: "Este ano",
      dataInicio: new Date(hoje.getFullYear(), 0, 1),
      dataFim: hoje
    },
    {
      value: "Último ano",
      dataInicio: new Date(hoje.getFullYear() - 1, 0, 1),
      dataFim: new Date(hoje.getFullYear(), 0, 1)
    }
  ];


  const [pesquisaPeriodo, setPesquisaPeriodo] = React.useState(periodos[0]);


  const service = new RegistroService();

  useEffect(() => {

    document.title = `Reportaí - Relatórios Públicos`;


  }, []);


  return (
    <div className='container pb-4'>

      {/* ---------------------- titulo ---------------------- */}
      <div className="row mt-3">
        <div className="col-12">
          <h2>Relatórios públicos</h2>
        </div>
      </div>

      {/* ---------------------- seletor ---------------------- */}
      <div className="row mt-3">
        <div className="col-12">

          <Form.Group className="mb-3 flex-grow-0">
            <Form.Label>Período</Form.Label>
            <Form.Select
              aria-label="Período"
              value={pesquisaPeriodo.value}
              onChange={event => {
                const periodoSelecionado = periodos.find(periodo => periodo.value === event.target.value);
                setPesquisaPeriodo(periodoSelecionado);
                console.log(periodoSelecionado.dataInicio.toISOString().split('T')[0]);
                console.log(periodoSelecionado.dataFim.toISOString().split('T')[0]);
              }}>

              {/*opções*/}
              {periodos.map((periodo, index) => (
                <option key={index} value={periodo.value}>{periodo.value}</option>
              ))}
            </Form.Select>
          </Form.Group>

        </div>
      </div>
    </div>
  );
}
