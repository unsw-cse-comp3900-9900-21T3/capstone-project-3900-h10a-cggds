import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import HomePageGuest from './components/home/HomePageGuest';
import NavigationBar from './components/navigation/NavigationBar';
import LoginPage from './components/user-account/LoginPage';
import RegisterPage from './components/user-account/RegisterPage';

function App() {
  return (
    <div>
      <Router>
        <NavigationBar/>
        <Switch>
          <Route path="/" exact component={HomePageGuest}/>
          <Route path="/login" exact component={LoginPage}/>
          <Route path="/register" exact component={RegisterPage}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
