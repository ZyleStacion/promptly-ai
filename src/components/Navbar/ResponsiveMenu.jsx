import { motion, AnimatePresence } from 'framer-motion';
import { MdLightMode } from "react-icons/md";
import React from 'react';  
import { NavbarMenu } from '../../mockData/data';

const ResponsiveMenu = ( {isOpen} ) => {
  return (
        <AnimatePresence mode="wait">
        {
            isOpen && <motion.div
            initial={{opacity: 0, y: -100}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -100}}
            transition={{duration: 0.3}}
            className='absolute top-20 left-0 w-full h-screen z-20 lg:hidden'
            >
                <div className='text-xl font-semibold uppercase bg-gradient-to-r from-blue-600 to-violet-600 text-white py-5  rounded-3xl justify-center items-center text-center' >   
                    {NavbarMenu.map((item) => {
                        return (
                        <li key={item.id} >
                            <a href={item.link} className="inline-block text-white py-3 
                                hover:text-secondary transition-all duration-300 font-semibold"> 
                                {item.title}
                            </a>
                        </li>
                        );

                        
                    })} 
                    <div className=" inline-flex rounded-xl p-3 items-center justify-center text-center bg-gray-800  space-x-6">
                            <button className='font-semibold'>Sign In</button>
                            <button className='text-white bg-secondary font-semibold rounded-full px-6 py-2'>Sign Up</button>

                        </div>
    
    
                </div>
            </motion.div>
        }
        </AnimatePresence>
    );
}

export default ResponsiveMenu