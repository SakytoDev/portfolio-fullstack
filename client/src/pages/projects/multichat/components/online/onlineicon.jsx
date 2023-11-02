import { useState, useEffect } from 'react'; 

export default function OnlineIcon({ className, socket, id }) {
  const [status, setStatus] = useState(false)

  useEffect(() => {
    socket.on('isOnline', (data) => { 
      if (data.id == id) setStatus(data.isOnline)
    })

    if (id) socket.emit('isOnline', id)

    return () => { socket.off('isOnline') }
  }, [id])

  return <div className={`${status ? 'bg-green-500' : 'bg-gray-500'} ${className}`}/>
}