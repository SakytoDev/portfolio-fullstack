export default function ToolTip({ position, children, parent }) {
  return (
    <div className='group relative'>
      <div>{parent}</div>
      <div className={`p-2 absolute 
        ${position === 'top' ? 'left-1/2 -translate-x-1/2 bottom-[calc(100%)]' : ''}
        ${position === 'bottom' ? 'left-1/2 -translate-x-1/2 top-[calc(100%)]' : ''}
        ${position === 'left' ? 'top-1/2 -translate-y-1/2 right-[calc(100%)]' : ''}
        ${position === 'right' ? 'top-1/2 -translate-y-1/2 left-[calc(100%)]' : ''}
        hidden group-hover:block`}>

        {children}
      </div>
    </div>
  )
}