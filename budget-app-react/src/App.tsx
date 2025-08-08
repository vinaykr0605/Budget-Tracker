import React from 'react';
import './App.css';
import { AppRoutes } from './App.routes';
import { Header } from './common/header/Header';
import { Footer } from './common/footer/Footer';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;