import { Route, Switch } from "react-router-dom";
import Home from './views/Home'
import SignUp from './views/SignUp'
import SignIn from './views/SignIn'
function App() {
  return (
    <div>
      <>
        <Switch>
          <Route exact path="/" render={(props) => <Home {...props} />} />
          <Route
            exact
            path="/signup"
            render={(props) => <SignUp {...props} />}
          />
          <Route
            exact
            path="/signin"
            render={(props) => <SignIn {...props} />}
          />
        </Switch>
      </>
    </div>
  );
}

export default App;
