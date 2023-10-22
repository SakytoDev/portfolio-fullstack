import { useState } from 'react';

import AccordionArrow from '../assets/accordionArrow.png';

export default function Accordion({ className, ticket }) {
  const [show, setShow] = useState(false)

  return (
    <button className={`grid grid-rows-[60px,auto] transition-all duration-500 ease-in-out ${show ? 'max-h-full' : 'max-h-[65px]'} ${className}`} onClick={() => setShow(!show)}>
      <div className='px-[22px] h-full flex items-center justify-between'>
        <p className='text-black font-miratrix text-[20px]'>{ticket.city}</p>
        <div className='flex items-center'>
          <p className='text-black font-miratrix text-[20px]'>{ticket.startDate}</p>
          <img className={`ms-2 transition-all duration-300 ease-in-out ${show ? '-rotate-180' : 'rotate-0'}`} src={AccordionArrow}/>
        </div>
      </div>
      <div className={`border-black grid grid-rows-2 gap-1 transition-all duration-500 ease-in-out overflow-hidden ${show ? 'max-h-full' : 'max-h-0'} pointer-events-none`}>
        <div className='bg-[#515151] p-5 flex justify-between'>
          <p className='font-miratrix text-white text-[16px]'>Время</p>
          <p className='font-miratrix text-white text-[16px]'>{ticket.startTime}</p>
        </div>
        <div className='bg-[#515151] p-5 flex justify-between'>
          <p className='font-miratrix text-white text-[16px]'>Площадка</p>
          <p className='font-miratrix text-white text-[16px]'>{ticket.area}</p>
        </div>
      </div>
    </button>
  )
}