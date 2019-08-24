//@ts-ignore-next-line
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Dashboard } from "./routes/Dashboard";
import { Redeem } from "./routes/Redeem";
import "./style.css";
import ProviderContext, {
  createProvider
} from "./utils/TemporaryProviderContext";

const provider = createProvider();

const App: React.FC = () => {
  return (
    //@ts-ignore
    <ProviderContext.Provider value={provider}>
      <Router>
        <header className="header">
          <h1>stikk.it!</h1>
        </header>

        <Route exact path="/" component={Dashboard}></Route>
        <Route path="/redeem" component={Redeem} />
        <Route path="/dashboard" component={() => <h1>Dashboard</h1>} />
        <Route path="/queue" component={() => <h1>Queue of stikkers</h1>} />
        <Route path="/save" component={() => <h1>Dashboard</h1>} />
      </Router>
    </ProviderContext.Provider>
  );
};

export default App;
