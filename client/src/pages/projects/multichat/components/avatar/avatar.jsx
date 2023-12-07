import { useState, useEffect } from 'react';

import axios from 'axios';

import accIcon from '../../assets/images/defaultAcc.png';

export default function Avatar({ className, id = null, source = null, socket }) {
  const [avatar, setAvatar] = useState(null)

  function getAvatar() {
    axios.get('/api', { params: { type: 'getAvatar', id: id } })
    .then(res => {
      const result = res.data
      if (result.code == 'success') setAvatar(result.image)
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    if (id) getAvatar()
    if (source) setAvatar(source)
  }, [id, source])

  useEffect(() => {
    if (!socket) return

    socket.on('avatarUpdate', (data) => {
      if (id == data.id) setAvatar(data.image)
    })

    return () => { socket.off('avatarUpdate') }
  }, [socket])

  return (
    <img className={`border-2 border-white bg-black rounded-full object-cover ${className}`} src={avatar ? avatar : accIcon}/>
  )
}