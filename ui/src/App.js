import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/SignUp';
import PopUp from './components/PopUp';
import './App.css';
import { useState } from 'react';
import Home from './components/Home';
import Tour from './components/Tour';

function App() {
  const [user, setUser] = useState(null);
  const [color, setColor] = useState(null);
  const [message, setMessage] = useState(null);
  return (
    <div className="App">
      <Header 
        user={user} 
        setUser={setUser} 
        setMessage={setMessage}
      />
      <PopUp 
        message={message}
        setMessage={setMessage}
        color={color}
      />
      <Routes>
        <Route path='/' element={<Home />}>
        </Route>
        <Route path='/tour/:id' element={<Tour />} />
        <Route 
          path='/login' 
          element={
            <Login 
              setUser={setUser} 
              setMessage={setMessage} 
              setColor={setColor}
            />
          }
        />
        <Route 
          path='/signup' 
          element={
            <SignUp 
              user={user}
              setMessage={setMessage}
              setColor={setColor}
              />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
