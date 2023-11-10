import accIcon from '../../assets/images/defaultAcc.png';

export default function MessageObj({ message }) {
  return (
    <div className='flex items-center p-2 border-b leading-snug'>
      <img className='ms-1 w-14 h-14' src={accIcon}/>
      <div className='ms-2'>
        <p className='font-bold'>{message.nickname}</p>
        <p>{message.message}</p>
        <p className='text-gray-500'>{message.sendDate}</p>
      </div>
    </div>
  )
}