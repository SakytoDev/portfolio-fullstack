import { useState } from 'react';

export default function Tabs({ components }) {
  const [tabIndex, setTabIndex] = useState(0)

  const tabs = [];

  components.forEach((component, index) => {
    tabs.push(
      <button className='group grid grid-rows-[1fr,0.5fr] p-3 font-medium' onClick={() => setTabIndex(index)}>
        <p className='transition-all ease-in-out text-2xl'>{component.props.title}</p>
        <div className={`bg-white rounded ${tabIndex == index ? 'ml-[0%] mr-[0%]' : 'ml-[100%] mr-[100%]'} mt-[6px] h-[3px] transition-all duration-400 ease-in-out group-hover:ml-[0%] group-hover:mr-[0%]`}></div>
      </button>
    )
  })

  return (
    <div>
      <div className='flex justify-center gap-2 py-5'>
        {tabs}
      </div>
      {components[tabIndex]}
    </div>
  )
}