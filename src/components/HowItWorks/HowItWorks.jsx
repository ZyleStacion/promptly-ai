import React from 'react'
import { FcAbout } from "react-icons/fc";
import { FcUpload } from "react-icons/fc";
import { FcDownload } from "react-icons/fc";
import { motion } from 'framer-motion';



const HowItWorksMenu =[
  {
    id: 1,
    title: '1. Chat with Our AI',
    description: 'Start a conversation with our untrained AI model to understand your business needs how our AI-driven solutions can transform your business operations and enhance efficiency.',
    icon: <FcAbout className="text-6xl mx-auto mb-4"/>,
    delay: 0.3,
  },
{
    id: 2,
    title: '2. Upload Your Data',
    description: 'Upload documents, files, and data about your business to train the model.',
    icon: <FcUpload className="text-6xl mx-auto mb-4"/>,
    delay: 0.6,
  },
{
    id: 3,
    title: '3. Download & Deploy',
    description: 'Get your trained AI model and deploy it locally in your infrastructure.',
    icon: <FcDownload className="text-6xl mx-auto mb-4"/>,
    delay: 0.9,
  },
]



const HowItWorks = () => {
  return (
    <div className=' bg-gray-900'>
        <div className='containers py-24'  >

            {/* header section */}
             <div className=' text-white space-y-4 p-6 text-center max-w-[500px] mx-auto mb-5'>    
                <h1 className=' text-5xl font-bold'>How It Works?</h1>
                <p>Three simple steps to get your custom AI model up and running</p>
           </div>

            {/* card section*/}
            <div className=' grid grid-cols-1 md:grid-cols-3 gap-6'>
                {HowItWorksMenu.map((item) => {
                    return (
                        <div className=' bg-neutral-950 text-white space-y-4 p-6 rounded-xl shadow-[0_0_22px_rgba(0,0,0,0.15)] hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] transition-all duration-300 text-center    '>
                            {/* icon section */}
                        <div>
                            <div className=' bg-gray-900 w-12 h-12 rounded-lg flex items-center text-center'>{item.icon}</div>
                        </div>
                        <p className=' font-bold text-2xl'>{item.title}</p>
                        <p>{item.description}</p>   
                        </div>
                    );
                })};
            </div>



        </div>

    </div>
  )
  
}

export default HowItWorks