import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import HomePageGuest from './components/home/HomePageGuest';
import NavigationBar from './components/navigation/NavigationBar';
import AddProductPage from './components/add-products/AddProductPage';
import LoginPage from './components/authentication/LoginPage';
import RegisterPage from './components/authentication/RegisterPage';
import AdminDashboardPage from './components/admin-dashboard/AdminDashboardPage';
import ItemPage from './components/item-page/ItemPage';
import MysteryBoxPage from './components/mystery-box/MysteryBoxPage';
import AdminHomePage from './components/admin-home/AdminHomePage';
import CheckoutPage from './components/checkout/CheckoutPage';
import CartPage from './components/checkout/CartPage';
import AccountPage from './components/account/AccountPage';
import SurveyPage from './components/survey/SurveyPage';
import PreviousOrders from './components/account/PreviousOrders';
import AccountDetailsPage from './components/account/AccountDetailsPage';
import Cookies from 'js-cookie';
import MysteryBoxAnimation from './components/mystery-box/MysteryBoxAnimation';
import ExplorePage from './components/explore/ExplorePage';
import 'tailwindcss/tailwind.css';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/authorization/Unauthorized';

function App() {
  const [admin, setAdmin] = useState(Cookies.get('admin'));
  const [token, setToken] = useState(Cookies.get('user'));
  const [itemId, setItemId] = useState('0');

  const makeAdmin = () => {
    setAdmin('true');
    Cookies.set('admin', 'true');
  };

  const removeAdmin = () => {
    setAdmin('false');
    Cookies.remove('admin');
  };

  const handleLogin = (token) => {
    setToken(token);
    Cookies.set('user', token);
  };

  const handleLogout = () => {
    setToken('');
    Cookies.remove('user');
  };

  return (
    <div>
      <Router>
        <NavigationBar
          admin={admin}
          token={token}
          setToken={setToken}
          setAdmin={setAdmin}
        />
        <Switch>
          <Route
            path='/cart'
            exact
            component={() => <CartPage token={token} />}
          />
          <Route path='/checkout' exact component={CheckoutPage} />
          <Route path='/product/:itemId' exact component={ItemPage} />
          <Route path='/adminhome' exact component={AdminHomePage} />
          <ProtectedRoute
            path='/addproduct'
            user={admin}
            setUser={setAdmin}
            component={AddProductPage}
          ></ProtectedRoute>
          <Route path='/admindash' exact component={AdminDashboardPage} />
          <Route path='/survey' exact component={SurveyPage} />
          <Route
            path='/'
            exact
            component={() => <HomePageGuest token={token} admin={admin} />}
          />
          <Route
            path='/login'
            exact
            component={() => (
              <LoginPage
                token={token}
                handleLogin={handleLogin}
                setAdmin={setAdmin}
              />
            )}
          />
          <Route
            path='/register'
            exact
            component={() => (
              <RegisterPage token={token} handleLogin={handleLogin} />
            )}
          />
          <Route path='/previousorders' exact component={PreviousOrders} />
          <Route path='/mysterybox' exact component={MysteryBoxPage} />
          <ProtectedRoute
            path='/account'
            user={admin}
            setUser={setAdmin}
            component={AccountPage}
          ></ProtectedRoute>
          <Route path='/accountdetails' exact component={AccountDetailsPage} />
          <Route path='/explore/:tag' exact component={ExplorePage} />
          <ProtectedRoute
            path='/mysterybox/opening/:boxName'
            user={admin}
            setUser={setAdmin}
            component={MysteryBoxAnimation}
          ></ProtectedRoute>
          <Route path='/unauthorized' component={Unauthorized}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
