import Rotas from "./rotas";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'toastr/build/toastr.min.css';
import ProvedorAutenticacao from "./provedorAutenticacao";

function App() {
  return (
    <div>
      <ProvedorAutenticacao>
        <Rotas/>
      </ProvedorAutenticacao>
    </div>
  );
}

export default App;
