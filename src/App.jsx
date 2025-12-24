import './App.css'
import Routers from './Route'
import Header from "./components/Header/Header.jsx";

function App() {

  return (
    <div className="app-layout">
      <Header  />
      <main className="app-main">
        <Routers />
      </main>
    </div>
  );
}

export default App
