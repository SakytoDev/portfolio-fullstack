import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { motion } from 'framer-motion';

import chatLogo from '../assets/images/chatLogo.png';

import websitelogo from '../assets/images/website.png';
import androidlogo from '../assets/images/android.png';
import windowslogo from '../assets/images/windows.png';

const block = {
  hidden: {
    x: -200,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: { ease: 'easeInOut', duration: 1 }
  }
}

export default function Projects() {
  return (
    <>
      <h1 className='pb-10 text-6xl text-center font-black'>Services:</h1>

      <motion.div initial='hidden' whileInView='visible' variants={block} className='rounded-3xl border-2 md:border-3 border-gray-300 mx-8 md:mx-16 mb-10'>
        <div className='flex items-center border-b-2 border-gray-300 p-5 md:p-10'>
          <img className='self-baseline w-16 h-16 md:w-24 md:h-24 rounded-2xl' src={chatLogo}/>
          <div className='ms-3 md:ms-5'>
            <div className='flex gap-2 md:gap-3'>
              <p className='text-3xl md:text-5xl font-bold'>MultiChat</p>
              <div className='md:border-2 rounded-lg flex items-center md:px-2 gap-2'>
                <img className='w-4 md:w-6' src={websitelogo}/>
                <img className='w-4 md:w-6' src={windowslogo}/>
                <img className='w-4 md:w-6' src={androidlogo}/>
              </div>
            </div>
            <p className='text-xl md:text-3xl mt-2'>Chat with friends or find new ones</p>
          </div>
        </div>

        <div className='border-gray-300'>
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            { !isMobile ? 
            <div className='grid border-r border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Web-version</h2>
              <Link className='mt-3 p-2 text-white rounded-md border-2 border-white flex items-center justify-center transition ease-in-out hover:bg-gray-300 hover:text-black' to='/multichat'>Enter</Link>
            </div> : null }
            { !isMobile ? 
            <div className='grid border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Windows</h2>
              <button className='mt-3 p-2 text-white rounded-md border-2 border-white disabled:text-gray-400 disabled:border-gray-500' disabled>Coming soon</button>
            </div> : null }
            { isMobile ? 
            <div className='grid border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Android</h2>
              <button className='mt-3 p-2 text-white rounded-md border-2 border-white' href="/download/android">Download</button>
            </div> : null }
          </div>
        </div>
      </motion.div>

      <h1 className='pb-10 text-6xl text-center font-black'>Designs:</h1>
      <motion.div initial='hidden' whileInView='visible' variants={block} className='rounded-3xl border-2 md:border-3 border-gray-300 mx-8 md:mx-16 mb-10'>
        <div className='flex items-center border-b-2 border-gray-300 p-5 md:p-10'>
          <div className='ms-3 md:ms-5'>
            <div className='flex gap-2 md:gap-3'>
              <p className='text-3xl md:text-5xl font-bold'>Noize MC</p>
              <div className='md:border-2 rounded-lg flex items-center md:px-2 gap-2'>
                <img className='w-4 md:w-6' src={websitelogo}/>
              </div>
            </div>
            <p className='text-xl md:text-3xl mt-2'>An example of what a concert poster on a website would look like</p>
          </div>
        </div>
        <div className='border-gray-300'>
          <div className='p-5'>
            <Link className='p-2 text-white rounded-md border-2 border-white flex items-center justify-center transition ease-in-out hover:bg-gray-300 hover:text-black' to='/noizemc'>Enter</Link>
          </div>
        </div>
      </motion.div>
    </>
  )
}