import React from 'react'
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import HowItWorks from './components/HowItWorks/HowItWorks';
import WhyChooseOurPlatform from './components/WhyChooseOurPlatform/WhyChooseOurPlatform';

export const App = () => {
  return (
  <main className='overflow-x-hidden bg-gray-900' >
      <Navbar/>
      <Hero/>
      <HowItWorks/>
      <WhyChooseOurPlatform/>

    </main>
  );
}

export default App;