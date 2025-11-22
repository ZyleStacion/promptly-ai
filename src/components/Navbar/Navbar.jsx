import React from 'react'
import { NavbarMenu } from '../../mockData/data';
import { LuBrain} from "react-icons/lu";
import { MdMenu } from "react-icons/md";
import {motion} from 'framer-motion';
import ResponsiveMenu from './ResponsiveMenu';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
    <nav>
        <div className="containers flex justify-between items-center py-3 px-10 bg-neutral-900">

            {/* logo section */}
            <a href="/">
              <div className=" text-2xl flex items-center gap-2 font-bold ">

                  <LuBrain className="text-3xl text-white bg-gradient-to-r from-blue-600 to-violet-600 text-transparent rounded-lg p-0.5"/>
                  <p className='text-white '>Promptly AI</p>
      
              </div>
            </a>  

            {/* menu section  */}
            <div className='hidden lg:block'>
                <ul className="flex items-center gap-6">
                    {NavbarMenu.map((item) => {
                      return (
                        <li key={item.id} >
                            <a href={item.link} className="inline-block text-white text-sm xl:text-base py-1 px-2 xl:px-3
                             hover:text-secondary transition-all duration-300 font-semibold"> 
                             {item.title}
                            </a>
                        </li>
                      );
                    })}    
                </ul>
            </div>


            {/* login/logout buttons section  */}
            <div className="hidden lg:block space-x-6">
              <button className='font-semibold text-white'>Sign In</button>
              <button className='text-white bg-secondary font-semibold rounded-full px-6 py-2'>Sign Up</button>

            </div>

            {/* mobile list section  */}
            <div className='lg:hidden' onClick={() => setIsOpen(!isOpen)} >
              <MdMenu className='text-4xl text-white hover:font-bold'/>
            </div>
        </div>
    </nav>

    {/* Mobile dropdown menu  */}
    <ResponsiveMenu isOpen={isOpen} />
    </>
  );
}

export default Navbar