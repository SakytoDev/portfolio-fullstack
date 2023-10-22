import React, { useState } from 'react';

export default function Tabs({ className, components }) {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <div>
      <div className={className}>
        { components.map((component, index) => {
          return ( <button key={index} className='group grid grid-rows-[1fr,auto] font-medium' onClick={() => setTabIndex(index)}>
            <p className='transition-all ease-in-out text-2xl'>{component.props.title}</p>
            <div className={`bg-white rounded ${tabIndex == index ? 'ml-[0%] mr-[0%]' : 'ml-[100%] mr-[100%]'} mt-[6px] h-[3px] transition-all duration-500 ease-in-out group-hover:ml-[0%] group-hover:mr-[0%]`}></div>
          </button> )
        }) }
      </div>
      {components[tabIndex]}
    </div>
  )
}