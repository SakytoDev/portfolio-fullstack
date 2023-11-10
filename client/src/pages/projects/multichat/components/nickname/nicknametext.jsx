import { useState, useEffect } from 'react'; 

import axios from 'axios';

export default function NicknameText({ className, id }) {
  const [nickname, setNickname] = useState('')
  
  function getNickname() {
    axios.get('/api', { params: { type: 'getAccInfo', id: id } })
    .then(res => {
      const result = res.data
      if (result.code == 'success') setNickname(result.account.nickname)
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    getNickname()
  }, [])

  return <p className={className}>{nickname}</p>
}