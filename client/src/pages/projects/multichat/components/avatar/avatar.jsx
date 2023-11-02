import { useState, useEffect } from 'react';

import axios from 'axios';

import accIcon from '../../assets/images/defaultAcc.png';

export default function Avatar({ className, id = null, source = null }) {
  const [avatar, setAvatar] = useState(null)

  async function getAvatar() {
    const result = await axios({ url: '/api', method: 'GET', params: { type: 'getAvatar', id: id }})
    .then(res => { return res.data })
    .catch(err => { console.log(err) })

    if (result.code == 'success') {
      setAvatar(result.image)
    }
  }

  useEffect(() => {
    if (id) getAvatar()
    if (source) setAvatar(source)
  }, [id, source])

  return (
    <img className={`border-2 border-white bg-black rounded-full object-cover ${className}`} src={avatar ? avatar : accIcon}/>
  )
}