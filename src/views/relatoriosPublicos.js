import React, {useEffect} from 'react';
import {RegistroService} from "../app/service/registroService";
import Form from "react-bootstrap/Form";
import {RelatorioService} from "../app/service/relatorioService";


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
  const [datasetBairros, setDatasetBairros] = React.useState([]);
  const [datasetCategorias, setDatasetCategorias] = React.useState([]);
  const [datasetStatus, setDatasetStatus] = React.useState([]);


  const service = new RelatorioService();
  useEffect(() => {
    document.title = `Reportaí - Relatórios Públicos`;
  }, []);

  useEffect(() => {

    const dataInicio = pesquisaPeriodo.dataInicio ? pesquisaPeriodo.dataInicio.toISOString().split('T')[0] : null;
    const dataFim = pesquisaPeriodo.dataFim ? pesquisaPeriodo.dataFim.toISOString().split('T')[0] : null;

    service
      .gerarRelatorioBairros(dataInicio, dataFim)
      .then(response => {
        setDatasetBairros(response.data);
      }).catch(error => {
      console.error(error);
    });

    service
      .gerarRelatorioCategorias(dataInicio, dataFim)
      .then(response => {
        setDatasetCategorias(response.data);
      }).catch(error => {
      console.error(error);
    });

    service
      .gerarRelatorioStatus(dataInicio, dataFim)
      .then(response => {
        setDatasetStatus(response.data);
      }).catch(error => {
      console.error(error);
    });

  }, [pesquisaPeriodo]);


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
              }}>

              {/*opções*/}
              {periodos.map((periodo, index) => (
                <option key={index} value={periodo.value}>{periodo.value}</option>
              ))}
            </Form.Select>
          </Form.Group>

        </div>
      </div>


      {/* ---------------------- gráficos ---------------------- */}
      <div className="row mt-4">

        {datasetBairros && datasetBairros.length > 0 && (
          <div className="col-12">
          </div>
        )}

      </div>


    </div>
  );
}
