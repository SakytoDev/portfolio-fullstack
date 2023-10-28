import { useState, useEffect } from 'react'; 

import axios from 'axios';

export default function NicknameText({ className, id }) {
  const [nickname, setNickname] = useState('')
  
  async function getNickname() {
    const result = await axios({ url: '/api', method: 'GET', params: { type: 'getAccInfo', id: id }})
    .then(res => { return res.data })
    .catch(err => { console.log(err) })

    if (result.code == 'success') {
      setNickname(result.account.nickname)
    }
  }

  useEffect(() => {
    getNickname()
  }, [])

  return <p className={className}>{nickname}</p>
}