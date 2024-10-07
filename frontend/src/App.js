import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Environment from './pages/Environment/Environment';
import EnergyConsumption from './pages/EnergyConsumption/EnergyConsumption';
import EnergyProduction from './pages/EnergyProduction/EnergyProduction';
import Settings from './pages/Settings/Settings';
import Control from './pages/Control/Control';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/environment" element={<Environment />} /> 
          <Route path="/energy-consumption" element={<EnergyConsumption />} /> 
          <Route path="/energy-production" element={<EnergyProduction />} /> 
          <Route path="/settings" element={<Settings />} /> 
          <Route path="/control" element={<Control />} />  
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
