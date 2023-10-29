import { useState, useEffect } from 'react'; 

export default function OnlineText({ onlineText, onlineStyle, offlineText, offlineStyle, className, socket, id }) {
  const [status, setStatus] = useState(false)

  useEffect(() => {
    socket.on('isOnline', (data) => { 
      if (data.id == id) {
        setStatus(data.isOnline)
      }
    })

    socket.emit('isOnline', id)

    return () => { socket.off('isOnline') }
  }, [])

  return <p className={`font-medium ${status ? onlineStyle : offlineStyle} ${className}`}>{status ? onlineText : offlineText}</p>
}