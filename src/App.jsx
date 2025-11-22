import React from 'react'
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import HowItWorks from './components/HowItWorks/HowItWorks';

export const App = () => {
  return (
  <main className='overflow-x-hidden bg-gray-900' >
      <Navbar/>
      <Hero/>
      <HowItWorks/>

    </main>
  );
}

export default App;