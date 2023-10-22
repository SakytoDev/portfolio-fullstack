export default function ToolTip({ position, children, parent }) {
  return (
    <div className='group relative flex items-center justify-center'>
      <div>{parent}</div>
      <div className={`absolute p-2 transition-all ease-in-out duration-300
        ${position === 'top' ? 'bottom-[calc(90%)] group-hover:bottom-[calc(100%)]' : ''}
        ${position === 'bottom' ? 'top-[calc(90%)] group-hover:top-[calc(100%)]' : ''}
        ${position === 'left' ? 'right-[calc(95%)] group-hover:right-[calc(100%)]' : ''}
        ${position === 'right' ? 'left-[calc(95%)] group-hover:left-[calc(100%)]' : ''}
        invisible opacity-0 group-hover:visible group-hover:opacity-100`}>

        {children}
      </div>
    </div>
  )
}

/* ${position === 'top' ? 'left-1/2 -translate-x-1/2 bottom-[calc(100%)]' : ''}
${position === 'bottom' ? 'left-1/2 -translate-x-1/2 top-[calc(100%)]' : ''}
${position === 'left' ? 'top-1/2 -translate-y-1/2 right-[calc(100%)]' : ''}
${position === 'right' ? 'top-1/2 -translate-y-1/2 left-[calc(100%)]' : ''} */