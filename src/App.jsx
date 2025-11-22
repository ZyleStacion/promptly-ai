import React from 'react'
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';

export const App = () => {
  return (
  <main className='overflow-x-hidden bg-gray-900' >
      <Navbar/>
      <Hero/>

    </main>
  );
}

export default App;