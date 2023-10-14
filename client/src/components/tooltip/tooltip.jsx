export default function ToolTip({ position, children, parent }) {
  return (
    <div className='group relative'>
      <div>{parent}</div>
      <div className={`absolute 
        ${position === 'top' ? 'left-1/2 -translate-x-1/2 bottom-[calc(100%+5px)]' : ''}
        ${position === 'bottom' ? 'left-1/2 -translate-x-1/2 top-[calc(100%+5px)]' : ''}
        ${position === 'left' ? 'top-1/2 -translate-y-1/2 right-[calc(100%+5px)]' : ''}
        ${position === 'right' ? 'top-1/2 -translate-y-1/2 left-[calc(100%+5px)]' : ''}
        transition-all ease-in-out opacity-0 group-hover:opacity-100`}>

        {children}
      </div>
    </div>
  )
}