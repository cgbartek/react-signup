import React, { Component } from 'react';
import NavBar from './components/navbar';
import SignupForm from './components/signupform';
//import './App.css';

class App extends Component {

  render() { 

    return (
      <>
      <NavBar/>
      <main className="container">
        <div className="card">
          <h5 className="card-header">Sign Up</h5>
          <SignupForm/>
        </div>
      </main>
      </>
    );
  }
  
}

export default App;
