import './App.css';
import React, { Component } from "react";
import { Redirect, BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Large/Login";
import Header from "./components/Medium/Header"
import Home from "./components/Large/Home"
import Footer from"./components/Medium/Footer"
import Profile from"./components/Medium/ProfilePage"


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
    }
  } 

  render(){
    return (
      <Router>
          <div>
            <Header/>
            <Footer/>
            <Redirect to="/login" />
            <Route exact path="/login" component={Login}/>
            <Route exact path="/home" component={Home}/>
            <Route exact path="/profile" component={Profile}/>
            
          </div>
      </Router>

    );
  }
}


export default App;
