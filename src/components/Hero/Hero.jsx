import React from 'react'
import HeroImg from '../../assets/Hero.png'
import { LuBrain} from "react-icons/lu";


const Hero = () => {
  return <>

    <div className=' bg-gray-900 containers grid grid-cols-1 md:grid-cols-2 min-h-[950px] md:px-5 relative'>
        {/* brand infor */}
        <div className=' flex flex-col mt-5 pt-24 px-8 pb-10 md:pr-10 xl:pr-30 '>
            <div className=' text-center md:text-left space-y-6'>
                <p className=' text-blue-400 font-bold flex items-center '><LuBrain/>AI Model Training Platform</p>
                <h1 className=' text-white text-5xl font-semibold'>Train Your Own <p className=' font-bold inline-block bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text'>AI Model</p> for Your Business</h1>
                <p className=' text-white pr-5'>Chat with our AI, upload your business data, and get a customized AI model trained specifically for your needs. Download and deploy it locally.</p>
                
                {/* button section */}
                <div className=' space-x-5'>
                    <button className=' text-gray-900 bg-gradient-to-r from-blue-600 to-violet-600 p-2 font-bold rounded-md hover:text-white transition-all duration-300 font-semibold'>Get Started</button>
                    <button className=' text-white'>Learn More</button>
                </div>

                {/* yapping */}
                <div className='   flex space-x-10 text-white justify-center md:justify-start xl:jus' >
                    <div>
                        <p className=' font-bold text-3xl'>500+</p>
                        <p >Businesses</p>
                    </div>
                    <div>
                        <p className=' font-bold text-3xl'>10K+</p>
                        <p>Models Trained</p>
                    </div>
                    <div>
                        <p className=' font-bold text-3xl'>99%</p>
                        <p>Satisfaction</p>
                    </div>
                </div>  

            </div>
        </div>


        {/* Hero image */}
        <img className='flex flex-col md:py-20 xl:py-0   ' src={HeroImg} alt="Ai Related Image" />


    </div>

  </>
}

export default Hero