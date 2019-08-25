//@ts-ignore-next-line
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Dashboard } from "./routes/Dashboard";
import { Redeem } from "./routes/Redeem";
import "./style.css";
import ProviderContext, {
  createProvider
} from "./utils/TemporaryProviderContext";
import PortisProviderContext, {
  createProvider as createPortisProvider
} from "./utils/PortisProviderContext";
import { Transfer } from "./routes/Transfer";

const provider = createProvider();
const portisProvider = createPortisProvider();

const App: React.FC = () => {
  return (
    //@ts-ignore
    <PortisProviderContext.Provider value={portisProvider}>
      <ProviderContext.Provider value={provider}>
        <Router>
          <Route exact path="/" component={Dashboard}></Route>
          <Route path="/claim" component={Redeem} />
          <Route path="/dashboard" component={() => <h1>Dashboard</h1>} />
          <Route path="/queue" component={() => <h1>Queue of stikkers</h1>} />
          <Route path="/details/:id" component={Transfer} />
        </Router>
      </ProviderContext.Provider>
    </PortisProviderContext.Provider>
  );
};

export default App;
