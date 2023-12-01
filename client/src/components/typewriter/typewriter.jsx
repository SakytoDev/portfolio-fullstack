import { useState, useEffect } from 'react';

//blink-caret

export default function Typewriter({ className, text, startDelay = 0, delay = 20, infinite = false }) {
  const [typewriter, setTypewriter] = useState('')
  
  let textArr = text
  let index = 0
  if (!Array.isArray(text)) { textArr = [text] }

  async function StartAnimation() {
    await Delay(startDelay)
    await AnimateText(textArr[index], delay, infinite)
      
    if (index < textArr.length) {
      index++
      if (index >= textArr.length && infinite) { index = 0 }

      StartAnimation() 
    }
  }

  function AnimateText(text, delay, infinite) {
    return new Promise(async(resolve) => {
      for (let i = 0; i < text.length; i++) {
        setTypewriter(prev => prev + text[i])
        await Delay(delay)
      }
  
      if (infinite) {
        await Delay(1000)
    
        for (let i = 0; i < text.length; i++) {
          setTypewriter(prev => prev.slice(0, -1))
          await Delay(delay)
        }
  
        resolve()
      } else {
        resolve()
      }
    })
  }

  function Delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  useEffect(() => {
    setTypewriter('')

    StartAnimation()
  }, [])

  return (
    <p className={className}>{typewriter}</p>
  )
}