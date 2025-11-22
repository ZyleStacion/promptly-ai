import React from 'react'
import HeroImg from '../../assets/Hero.png'
import { LuBrain} from "react-icons/lu";
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const Hero = () => {
  return <>

    <div className=' bg-gray-900 containers grid grid-cols-1 md:grid-cols-2 min-h-[650px] md:px-5 relative'>
        {/* brand infor */}
        <div className=' flex flex-col mt-5 pt-24 px-8 pb-10 md:pr-10 xl:pr-30 '>
            <div className=' text-center md:text-left space-y-6'>
                <motion.p
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x:0}}
                transition={{duration: 0.2}}
                 className=' text-blue-400 font-bold flex items-center '><LuBrain/>AI Model Training Platform</motion.p>

                <motion.h1
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x:0}}
                transition={{duration: 0.4}}
                 className=' text-white text-5xl font-semibold'>Train Your Own <p className=' font-bold inline-block bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text'>AI Model</p> for Your Business</motion.h1>

                <motion.p
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x:0}}
                transition={{duration: 0.6}}
                 className=' text-white pr-5'>Chat with our AI, upload your business data, and get a customized AI model trained specifically for your needs. Download and deploy it locally.</motion.p>
                
                {/* button section */}
                <motion.div
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x:0}}
                transition={{duration: 0.8}}
                 className=' space-x-5'>
                    <button className='primary-btn'>Get Started</button>
                    <button className=' text-white'>Learn More</button>
                </motion.div>

                {/* yapping */}
                <motion.div
                initial={{opacity: 0, }}
                animate={{opacity: 1, }}
                transition={{duration: 0.5}}
                 className='   flex space-x-10 text-white justify-center md:justify-start xl:jus' >
                    <div>
                        <p className=' font-bold text-3xl'> <CountUp start={0} end={500} duration={2}  enableScrollSpy={true} scrollSpyOnce={true}  /> <p className='  inline-flex'>+</p></p>
                        <p >Businesses</p>
                    </div>
                    <div>
                        <p className=' font-bold text-3xl'><CountUp start={0} end={10000} duration={2}  enableScrollSpy={true} scrollSpyOnce={true}  /> <p className='  inline-flex'>+</p></p>
                        <p>Models Trained</p>
                    </div>
                    <div>
                        <p className=' font-bold text-3xl'><CountUp start={0} end={99} duration={2} enableScrollSpy={true} scrollSpyOnce={true}  /> <p className='  inline-flex'>%</p></p>
                        <p>Satisfaction</p>
                    </div>
                </motion.div>  

            </div>
        </div>


        {/* Hero image */}

        <div className='flex justify-center items-center  '>
            <motion.img  
            initial={{ opacity: 0, x:200}}
            animate={{ opacity: 1, x:0}}
            transition={{ type: "string", stiffness: 100, delay:0.2}}
                src={HeroImg} 
                alt="Ai Related Image"
                className=' w-[550px] md:w-[550px] xl:w-[700px]'

            />
        </div>

    </div>

  </>
}

export default Hero