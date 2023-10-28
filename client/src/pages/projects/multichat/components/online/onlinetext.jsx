import { useState, useEffect } from 'react'; 

export default function OnlineText({ className, socket, id }) {
  const [status, setStatus] = useState(false)

  useEffect(() => {
    socket.on('isOnline', (data) => { setStatus(data) })

    socket.emit('isOnline', { id: id })

    return () => { socket.off('isOnline') }
  }, [])

  return <p className={`${status ? 'text-green-500' : 'text-gray-500'} ${className}`}>{status ? 'Online' : 'Offline'}</p>
}