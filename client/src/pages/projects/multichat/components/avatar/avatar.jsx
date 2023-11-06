import { useState, useEffect } from 'react';

import axios from 'axios';

import accIcon from '../../assets/images/defaultAcc.png';

export default function Avatar({ className, id = null, source = null }) {
  const [avatar, setAvatar] = useState(null)

  function getAvatar() {
    axios({ url: '/api', method: 'GET', params: { type: 'getAvatar', id: id }})
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

  return (
    <img className={`border-2 border-white bg-black rounded-full object-cover ${className}`} src={avatar ? avatar : accIcon}/>
  )
}