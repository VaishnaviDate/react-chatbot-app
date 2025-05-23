import React from 'react';
import './App.css';
import ChatBot from './Chatbot';
import { Icon } from '@iconify/react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3>Farming AI Bot</h3>
        <Icon icon="fluent-mdl2:chat-bot" style={{marginLeft:"10px"}} width="40px" height="40px"/>
      </header>
      <main>
        <ChatBot />
      </main>
    </div>
  );
}


export default App;
