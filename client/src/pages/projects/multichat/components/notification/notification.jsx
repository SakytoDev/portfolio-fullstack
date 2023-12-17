import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import closeIcon from '../../assets/images/close.png';

export default function NotificationObj({ notification, removeNotification }) {
  const [isShown, setShow] = useState(true)

  const variants = {
    hidden: {
      opacity: 0,
      x: -50,
      transition: { ease: 'easeOut', duration: 0.35 }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { ease: 'easeOut', duration: 0.35 }
    }
  }

  function closeNotify() {
    setShow(false)
  }

  function onAnimCompleted() {
    if (!isShown) {
      removeNotification(notification)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={isShown ? variants.visible : variants.hidden} onAnimationComplete={onAnimCompleted} className={`bg-zinc-700 border-2 ${notification.type == 'error' ? 'border-red-500' : ''} ${notification.type == 'warning' ? 'border-orange-500' : ''} ${notification.type == 'success' ? 'border-green-500' : ''} ${notification.type == 'default' ? 'border-zinc-500' : ''} px-3 w-[25rem] rounded-lg flex flex-row items-center justify-center`}>
      <p className='font-medium text-lg text-white break-words'>{notification.message}</p>
      <button className='py-2 ml-auto' onClick={() => closeNotify()}>
        <img className='w-6 h-6' src={closeIcon}/>
      </button>
    </motion.div>
  )
}
