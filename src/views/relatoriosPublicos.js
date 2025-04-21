import React, {useEffect} from 'react';
import Form from "react-bootstrap/Form";
import {RelatorioService} from "../app/service/relatorioService";
import {BarChart} from '@mui/x-charts/BarChart';
import {PieChart} from "@mui/x-charts";


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
  const [totalRegistros, setTotalRegistros] = React.useState(0);
  const [totalRegistrosAtivos, setTotalRegistrosAtivos] = React.useState(0);

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
        console.log(response.data);
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
        setTotalRegistros(response.data.reduce((acc, item) => acc + item.quantidade, 0));
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
      {/*https://mui.com/x/react-charts/bars/*/}
      <div className="row">


        {/* ---------------------- bairros ---------------------- */}
        {datasetBairros && datasetBairros.length > 0 && (
          <div className="col-lg-12 p-1 ">
            <div className=" border rounded p-3">
              <h4>Registros por Bairro</h4>
              <div style={{maxHeight: 500, overflowY: 'auto'}}>
                <BarChart
                  dataset={datasetBairros}
                  xAxis={[{scaleType: 'linear', tickMinStep: 1}]}
                  yAxis={[{scaleType: 'band', dataKey: 'bairro', width: 130, barSize: 35}]}
                  height={datasetBairros.length * 40}
                  series={[
                    {
                      dataKey: 'ativo',
                      label: 'Ativo',
                      stack: 'total',
                      color: '#f1c553',
                    },
                    {
                      dataKey: 'concluido',
                      label: 'Concluído',
                      stack: 'total',
                      color: '#279700D1',
                    },
                  ]}
                  layout="horizontal"
                  grid={{vertical: true}}
                  barLabel="value"
                />

              </div>

            </div>
          </div>
        )}


        {/* ---------------------- categorias ---------------------- */}
        {datasetBairros && datasetBairros.length > 0 && (
          <div className="col-lg-6 p-1">
            <div className=" border rounded p-3">
              <h4>Registros por Categorias</h4>
              <BarChart
                dataset={datasetCategorias}
                height={450}
                xAxis={[{scaleType: 'linear', dataKey: 'quantidade', tickMinStep: 1}]}
                yAxis={[{scaleType: 'band', dataKey: 'categoria', width: 130}]}
                series={[
                    {
                      dataKey: 'ativo',
                      label: 'Ativo',
                      stack: 'total',
                      color: '#f1c553',
                    },
                    {
                      dataKey: 'concluido',
                      label: 'Concluído',
                      stack: 'total',
                      color: '#279700D1',
                    },
                  ]}
                layout="horizontal"
                grid={{vertical: true}}
                barLabel="value"
              />
            </div>
          </div>
        )}

        {/* ---------------------- status ---------------------- */}
        {datasetStatus && datasetStatus.length > 0 && (
          <div className="col-lg-6 p-1">
            <div className=" border rounded p-3">
              <h4>Registros por Status</h4>
              <PieChart
                series={[
                  {
                    arcLabel: (item) => `${item.value} (${(item.value / totalRegistros * 100).toFixed(0)}%)`,
                    arcLabelMinAngle: 35,
                    arcLabelRadius: '60%',
                    innerRadius: '40%',
                    data: [
                      {id: 0, value: datasetStatus[0].quantidade, label: datasetStatus[0].status, color: '#f1c553'},
                      {id: 1, value: datasetStatus[1].quantidade, label: datasetStatus[1].status, color: '#279700D1'},
                    ],
                  },
                ]}
                height={450}

              />
            </div>
          </div>
        )}

        {
          totalRegistros == 0 && (
            <div className="col-12 mt-5 justify-content-center align-items-center d-flex text-center">
              ℹ️ <br/>
              Nenhum registro encontrado! <br/>
              Verifique se o período selecionado possui registros cadastrados.
            </div>
          )
        }

      </div>


    </div>
  );
}
