import { Routes, Route } from 'react-router-dom';
import Home from './Home';

function Main() {
    return (
        <main className='main-body'>
            <Routes>
                <Route path='*' element={<Home />} /> 
            </Routes>
        </main>
    );
}

export default Main;