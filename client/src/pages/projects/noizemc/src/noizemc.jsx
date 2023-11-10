import { motion } from 'framer-motion'

import Accordion from './components/accordion';
import Footer from './components/footer';

import portait from './assets/portrait.png';
import arrow from './assets/arrow.png';

import vk from './assets/vk.png';
import instagram from './assets/instagram.png';
import youtube from './assets/youtube.png';

const city1 = [
  'london', 
  'helsinki', 
  'tallin', 
  'riga', 
  'munich', 
  'haarlem', 
  'paris', 
  'berlin', 
  'prague', 
  'warsaw',
  'vilnius',
  'zurich',
  'geneve',
  'barcelone',
  'limassol',
  'tashkent'
]

const city2 = [
  'boston', 
  'chicago', 
  'washington', 
  'atlanta', 
  'miami', 
  'denver', 
  'houston', 
  'los angeles', 
  'new york', 
  'toronto',
  'montreal',
  'calgary',
  'edmonton',
  'vancouver',
  'seattle',
  'san francisco'
]

const tickets = [
  {
    city: 'Лондон',
    startDate: '21.10.22',
    startTime: '7:00 PM',
    area: 'Royal Albert Hall',
    isAvailable: true
  },
  {
    city: 'Таллин',
    startDate: '25.10.22',
    startTime: '8:00 PM',
    area: 'Tallinn Song Festival Grounds',
    isAvailable: true
  },
  {
    city: 'Рига',
    startDate: '26.10.22',
    startTime: '7:45 PM',
    area: 'Riga Arena',
    isAvailable: true
  },
  {
    city: 'Минич',
    startDate: '28.10.22',
    startTime: '9:15 PM',
    area: 'Minich Opera House',
    isAvailable: false
  },
  {
    city: 'Харлем',
    startDate: '29.10.22',
    startTime: '8:30 PM',
    area: 'Apollo Theater',
    isAvailable: true
  },
  {
    city: 'Хельсинки',
    startDate: '29.10.22',
    startTime: '6:30 PM',
    area: 'Helsinki Music Hall',
    isAvailable: true
  },
  {
    city: 'Париж',
    startDate: '30.10.22',
    startTime: '7:30 PM',
    area: 'Palais Garnier',
    isAvailable: true
  },
  {
    city: 'Берлин',
    startDate: '31.10.22',
    startTime: '8:15 PM',
    area: 'Berlin Philharmonie',
    isAvailable: true
  },
  {
    city: 'Прага',
    startDate: '2.11.22',
    startTime: '7:45 PM',
    area: 'Prague Castle Courtyard',
    isAvailable: true
  },
  {
    city: 'Варшава',
    startDate: '3.11.22',
    startTime: '6:00 PM',
    area: 'Warsaw National Stadium',
    isAvailable: true
  },
  {
    city: 'Вильнус',
    startDate: '3.11.22',
    startTime: '9:00 PM',
    area: 'Vilnius Old Town Square',
    isAvailable: true
  },
  {
    city: 'Женева',
    startDate: '9.11.22',
    startTime: '8:30 PM',
    area: 'Geneva Opera House',
    isAvailable: true
  },
  {
    city: 'Барселона',
    startDate: '10.11.22',
    startTime: '7:15 PM',
    area: 'Palau de la Música Catalana',
    isAvailable: true
  },
  {
    city: 'Лимассол',
    startDate: '12.11.22',
    startTime: '8:00 PM',
    area: 'Limassol Marina Amphitheatre',
    isAvailable: true
  },
  {
    city: 'Бостон',
    startDate: '13.11.22',
    startTime: '7:30 PM',
    area: 'TD Garden',
    isAvailable: true
  },
  {
    city: 'Торонто',
    startDate: '15.11.22',
    startTime: '8:45 PM',
    area: 'Scotiabank Arena',
    isAvailable: true
  },
  {
    city: 'Вашингтон',
    startDate: '15.11.22',
    startTime: '7:00 PM',
    area: 'Green oasis',
    isAvailable: true
  },
  {
    city: 'Атланта',
    startDate: '19.11.22',
    startTime: '6:45 PM',
    area: 'The Fox Theatre',
    isAvailable: true
  },
  {
    city: 'Чикаго',
    startDate: '21.11.22',
    startTime: '9:00 PM',
    area: 'Concord Music Hall',
    isAvailable: true
  }
]

const portraitAnim = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

export default function NoizeMC() {
  return (
    <>
      <div className='pt-3 leading-[1.1]'>
        <section className='relative px-[10px] md:px-[18px]'>
          <div className='pt-[48px]'>
            <div className='grid md:grid-cols-[auto,254px] lg:grid-cols-[auto,260px] xl:grid-cols-[auto,431px] justify-start'>
              <p className='font-miratrix md:me-[23px] lg:me-[36px] xl:me-4 text-[20px] xl:text-[40px]'>NOIZE MC</p>
              <motion.hr transition={{ ease: 'easeInOut', duration: 1.5 }} animate={{ maxWidth: '100%' }} className='hidden md:block border xl:border-2 rounded-none border-black mt-2'/>
            </div>
            <div className='flex items-center gap-5'>
              <p className='font-miratrix text-[32px] md:text-[40px] xl:text-[68px]'>ВСЁ КАК У ЛЮДЕЙ</p>
              <p className='font-miratrix text-[28px] md:text-[36px] xl:text-[40px]'>18+</p>
            </div>
            <div className='flex pt-1 px-[3px]'>
              <p className='font-miratrix text-[20px] xl:text-[40px] me-[33px] md:me-[73px] lg:me-[106px] xl:me-[100px] 2xl:me-[159px]'>ТУР</p>
              <p className='font-miratrix text-[20px] xl:text-[40px] me-[13px] md:me-[54px] lg:me-[82px] xl:me-[55px] 2xl:me-[111px]'>2022</p>
              <div className='relative flex items-center justify-center'>
                <p className='font-miratrix text-[20px] xl:text-[40px]'>РОССИЯ</p>
                <motion.div transition={{ ease: 'easeInOut', delay: 1.5, duration: 1 }} animate={{ maxWidth: '100%' }} className='absolute bg-black w-full h-[2px] md:h-[4px]'/>
              </div>
            </div>
            <div className='grid grid-cols-[70px,70px,80px] md:grid-cols-[110px,110px,125px] lg:grid-cols-[140px,140px,140px] xl:grid-cols-[167px,167px,167px] 2xl:grid-cols-[206px,206px,206px] 2xl:gap-[19px]'>
              <motion.img transition={{ ease: 'easeInOut', duration: 1.5 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='w-[17px] md:w-[18px] lg:w-[19px] xl:w-[30px]' src={arrow}/>
              <div className='text-[#C9C9C9] leading-tight font-miratrix uppercase text-[9px] md:text-[16px] xl:text-[19px] pt-[37px]'>
                { city1.map((city, index) => {
                  return <p key={index}>{city}</p>
                })}
              </div>
              <div className='text-[#C9C9C9] leading-tight font-miratrix uppercase text-[9px] md:text-[16px] xl:text-[19px] pt-[37px]'>
                { city2.map((city, index) => {
                  return <p key={index}>{city}</p>
                })}
              </div>
            </div>
            <div className='flex gap-5 items-end pt-[30px] lg:pt-[60px]'>
              <button className='bg-black text-white border-[3px] border-black font-miratrix rounded-none md:mb-[30px] lg:mb-0 w-[191px] h-[33px] md:w-[303px] md:h-[52px] lg:w-[400px] xl:w-[486px] 2xl:w-[657px] lg:h-[68px] xl:h-[80px] md:text-[32px] xl:text-[40px] transition ease-in-out hover:bg-white hover:text-black'>КУПИТЬ БИЛЕТЫ</button>
              <a className='hidden lg:flex items-center justify-center lg:border-[2px] xl:border-[3px] border-black lg:w-[30px] lg:h-[30px] xl:w-[40px] xl:h-[40px] 2xl:w-[56px] 2xl:h-[56px]' href='https://www.instagram.com/noizemc' target='_blank'>
                <img className='lg:w-[16px] lg:h-[16px] xl:w-[21px] xl:h-[21px] 2xl:w-[30px] 2xl:h-[30px]' src={instagram}/>
              </a>
              <a className='hidden lg:flex items-center justify-center lg:border-[2px] xl:border-[3px] border-black lg:w-[30px] lg:h-[30px] xl:w-[40px] xl:h-[40px] 2xl:w-[56px] 2xl:h-[56px]' href='https://vk.com/noizemc' target='_blank'>
                <img className='lg:w-[16px] lg:h-[16px] xl:w-[21px] xl:h-[21px] 2xl:w-[30px] 2xl:h-[30px]' src={vk}/>
              </a>
              <a className='hidden lg:flex items-center justify-center lg:border-[2px] xl:border-[3px] border-black lg:w-[30px] lg:h-[30px] xl:w-[40px] xl:h-[40px] 2xl:w-[56px] 2xl:h-[56px]' href='https://www.youtube.com/channel/UCgzshmpXAc1T30PHQ3Yw2lw' target='_blank'>
                <img className='lg:w-[16px] lg:h-[16px] xl:w-[21px] xl:h-[21px] 2xl:w-[30px] 2xl:h-[30px]' src={youtube}/>
              </a>
            </div>
          </div>
          <motion.img transition={{ ease: 'easeInOut', delay: 1, duration: 1 }} initial='hidden' animate='visible' variants={portraitAnim} className='absolute overflow-hidden object-contain w-[200px] h-[312px] md:w-[404px] md:h-[606px] lg:w-[523px] lg:h-[753px] xl:w-[572px] xl:h-[824px] 2xl:w-[572px] 2xl:h-[857px] left-[190px] top-32 md:left-[364px] md:top-6 lg:left-[475px] lg:top-6 xl:left-[625px] xl:top-6 2xl:left-[834px] 2xl:top-3 -z-[1]' src={portait}/>
        </section>
        <section className='pt-[30px] lg:mt-[60px] lg:pt-[60px] bg-white border-t-[4px] border-[rgba(0,0,0,0.25)]'>
          <div className='px-[18px] flex justify-center gap-5'>
            <div className='flex flex-col gap-5'>
              { tickets.map((ticket, index) => {
                return (
                  <div key={index} className='flex md:gap-5'>
                    <Accordion className='border-[3px] border-black w-[300px] md:w-[430px]' ticket={ticket}/>
                    <button className='bg-black text-white border-l-0 md:border-l-[3px] border-[3px] border-black font-miratrix w-[90px] md:w-[206px] h-[65px] text-[15px] md:text-[20px] disabled:bg-[#515151] disabled:border-[#515151] transition ease-in-out enabled:hover:bg-white enabled:hover:text-black' disabled={!ticket.isAvailable}>{ ticket.isAvailable ? 'КУПИТЬ' : 'Продано'}</button>
                  </div>
                )
              }) }
            </div>
            <div className='hidden xl:block'>
              <p className='font-miratrix text-[40px]'>О type “Всё как у людей”</p>
              <iframe className='xl:mt-[76px] 2xl:mt-[43px] xl:w-[485px] xl:h-[273px] 2xl:w-[884px] 2xl:h-[498px]' src='https://www.youtube.com/embed/wyhI5C87c3U'/>
              <motion.p transition={{ ease: 'easeInOut', duration: 1 }} initial={{ y: -50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.55 }} className='font-helvetica leading-snug mt-[49px] text-[20px]'>«Lietus» — это «дождь» по-литовски. А «Литва» будет «Lietuva» — «Дождьва», «Дождьляндия», «Дождестан», «СТРАНА ДОЖДЕЙ».Это ещё лет 20 назад рассказал мне наш самый первый барабанщик — Андрей Пих из Висагинаса. Мы создали эту группу втроём — я, Саня Кислый и он (Andrius). В 2004-м году Андрей закончил наш универ, съехал из общаги и отправился домой. Мы удивлялись — все в нашем кругу так цеплялись за Москву, а он взял и вернулся. Теперь Литва — и мой дом. Вот уже 7 месяцев. Я полюбил Вильнюс всей душой. Уже совсем скоро — 8 октября — именно здесь, в клубе LOFTAS, начнётся наш большой евро-американский тур.</motion.p>
              <motion.p transition={{ ease: 'easeInOut', duration: 1 }} initial={{ y: -50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.55 }} className='font-helvetica leading-snug mt-[20px] text-[20px]'>Этот тур многое значит для меня и всей команды. В нём собраны все наши чувства, эмоции и переживания, скопившееся за последние 8 месяцев, а также лучшие треки за 20 лет существования группы. Новые и старые.</motion.p>
              <motion.p transition={{ ease: 'easeInOut', duration: 1 }} initial={{ y: -50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.55 }} className='font-helvetica leading-snug mt-[89px] text-[20px]'>До встречи в вашем городе. Всем мира.</motion.p>
            </div>
          </div>
        </section>
      </div>
      <Footer/>
    </>
  )
}