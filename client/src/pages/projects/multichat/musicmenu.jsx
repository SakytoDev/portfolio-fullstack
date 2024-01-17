import { useState, useEffect, useRef } from 'react';
import { DateTime } from 'luxon';

import axios from 'axios';

import playIcon from './assets/images/play.png';
import pauseIcon from './assets/images/pause.png';
import volumeIcon from './assets/images/volume.png';
import muteIcon from './assets/images/mute.png';
import repeatIcon from './assets/images/repeat.png';
import closeIcon from './assets/images/close.png';

function MusicForm({ setState, addNotification }) {
  const [formLoading, setFormLoading] = useState(false)
  const [musicForm, setMusicForm] = useState({})

  const handleFormChange = (e) => {
    setMusicForm({
      ...musicForm,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = async (e) => {
    if (e.target.files[0] === undefined) {
      setMusicForm({
        ...musicForm,
        [e.target.name]: null
      })
      return
    }

    setMusicForm({
      ...musicForm,
      [e.target.name]: e.target.files[0]
    })
  }

  function sendRequest() {
    if (musicForm?.musicName === null || musicForm?.musicName == '') return
    if (musicForm?.artists === null || musicForm?.artists == '') return
    if (musicForm?.music === null || musicForm?.music == '') return

    setFormLoading(true)

    var formData = new FormData()
    formData.append('musicName', musicForm?.musicName)
    formData.append('artists', musicForm?.artists)
    formData.append('music', musicForm?.music)

    axios.post('/api/requestMusic', formData)
    .then(res => {
      setMusicForm({})
      setState(false)
      setFormLoading(false)

      addNotification({ type: 'success', message: 'Music request successfully sended' })
    })
    .catch(err => console.log(err))
  }

  return (
    <div className='bg-black bg-opacity-50 absolute inset-0 flex items-center justify-center'>
      <div className='p-5 bg-[#2d3034] border rounded-xl flex flex-col'>
        { !formLoading
        ?
        <button className='self-end' onClick={() => setState(false)}>
          <img src={closeIcon} className='w-8 h-8'/>
        </button>
        : null }
        <div className='mt-2 flex flex-col gap-5'>
          <p className='text-2xl font-bold text-center'>Request music form:</p>
          <div className='flex flex-col gap-2'>
            <label className='flex flex-col'>* Music Name:
              <input type='text' name='musicName' className='px-2 py-1 border-2 rounded outline-none' onChange={handleFormChange}/>
            </label>
            <label className='flex flex-col'>* Artists:
              <input type='text' name='artists' className='px-2 py-1 border-2 rounded outline-none' onChange={handleFormChange}/>
            </label>
            <label className='flex flex-col'>* Music File:
              <input type='file' name='music' accept='audio/*' className='p-1 border-2 rounded outline-none' onChange={handleFileChange}/>
            </label>
          </div>
          <button className='p-1 border-2 disabled:border-indigo-600 enabled:border-indigo-500 rounded-xl transition ease-in-out enabled:hover:bg-indigo-600' disabled={formLoading} onClick={() => sendRequest()}>{ formLoading ? 'Sending...' : 'Send Request' }</button>
        </div>
      </div>
    </div>
  )
}

function MusicObj({ data, play, playing, className }) {
  const [coverData, setCoverData] = useState('')

  function getMusicCover() {
    axios.get('/api', { params: { type: 'getMusicCover', id: data._id } })
    .then(res => { setCoverData(res.data) })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    getMusicCover()
  }, [data])

  return (
    <div className={`p-2 border-2 rounded-xl flex items-center justify-between ${className}`}>
      <div className='flex items-center gap-2'>
        <img className='w-12 h-12 rounded' src={coverData}/>
        <div>
          <p className='font-medium'>{data.name}</p>
          <p className='opacity-50'>{data.artists}</p>
        </div>
      </div>
      <button onClick={() => play({...data, cover: coverData})}>
        <img src={playing ? pauseIcon : playIcon} className='w-8 h-8'/>
      </button>
    </div>
  )
}

export default function MusicMenu({ addNotification }) {
  const [formState, setFormState] = useState(false)

  const [search, setSearch] = useState('')

  const [musicList, setMusicList] = useState([])
  const [selectedMusic, setSelectedMusic] = useState({})

  const [playing, setPlay] = useState(false)
  const [looping, setLoop] = useState(false)

  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const [volume, setVolume] = useState(0.5)
  const [muted, setMute] = useState(false)
  
  const musicPlayer = useRef(null)

  function getMusicList() {
    axios.get('/api', { params: { type: 'getAllMusic' } })
    .then(res => {
      const result = res.data

      setMusicList(result.music)
    })
    .catch(err => console.log(err))
  }

  function getMusicData(data) {
    axios.get('/api', { params: { type: 'getMusic', id: data._id } })
    .then(res => {
      const newData = {...data}
      newData.music = res.data

      setSelectedMusic(newData) 
    })
    .catch(err => console.log(err))
  }

  function playMusic(data) {
    if (data._id != selectedMusic._id) {
      setPlay(false)

      getMusicData(data)
    } else {
      setPlay(curr => !curr)
    }
  }

  useEffect(() => {
    setPlay(true)
  }, [selectedMusic])

  useEffect(() => {
    playing ? musicPlayer.current.play() : musicPlayer.current.pause()
  }, [playing])

  useEffect(() => {
    musicPlayer.current.volume = muted ? 0 : volume
  }, [volume, muted])

  useEffect(() => {
    getMusicList()
  }, [])

  return (
    <div className='bg-[#2d3034]'>
      <div className='h-full pt-4 grid grid-rows-[auto,1fr,auto] gap-5'>
        <div className='px-36 flex items-stretch gap-2'>
          <input type='text' placeholder='Find music by name...' className='flex-1 px-2 py-1 border-2 rounded-lg outline-none text-xl' onChange={(e) => setSearch(e.target.value)}/>
          <button className='px-2 border-2 border-indigo-500 rounded-lg transition ease-in-out hover:bg-indigo-600' onClick={() => setFormState(true)}>Request music</button>
        </div>
        <div className='px-36 flex flex-col gap-2'>
          { musicList.map((item, index) => {
            return <MusicObj key={index} data={item} play={playMusic} playing={playing && item._id == selectedMusic._id} className={item.name.includes(search) ? 'block' : 'hidden'}/>
          })}
        </div>
        <div className='flex-1'>
          <div className={`p-2 bg-[#212529] ${selectedMusic?.music ? 'grid grid-cols-3' : 'hidden'} items-center`}>
            <div className='flex items-center gap-2'>
              <img className='w-16 h-16 rounded' src={selectedMusic.cover}/>
              <div>
                <p className='font-medium'>{selectedMusic.name}</p>
                <p className='opacity-50 text-sm'>{selectedMusic.artists}</p>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <div className='grid grid-cols-3 place-items-center'>
                <div className='flex items-center justify-center gap-2 justify-self-end'>
                  <button onClick={() => setMute(curr => !curr)}>
                    <img src={volume > 0 && !muted ? volumeIcon : muteIcon} className='w-5 h-5'/>
                  </button>
                  <input type='range' className='volumeSlider w-12' min={0} max={100} onChange={(e) => { setVolume(e.target.value / 100); setMute(false) }}/>
                </div>
                <button onClick={() => setPlay(curr => !curr)}>
                  <img src={playing ? pauseIcon : playIcon} className='w-10 h-10'/>
                </button>
                <button className={`p-1 transition ease-in-out ${looping ? 'bg-indigo-600' : 'bg-transparent'} rounded`} onClick={() => setLoop(curr => !curr)}>
                  <img src={repeatIcon} className='w-4 h-4'/>
                </button>
              </div>
              <div className='place-self-stretch text-xs font-medium'>
                { duration != 0 && duration != null
                ?
                <div className='grid grid-cols-[0.1fr,1fr,0.1fr] items-center gap-2'>
                  <p>{DateTime.fromSeconds(time).toFormat('m:ss')}</p>
                  <input type='range' className='musicSlider' min={0} value={time} max={duration} onChange={(e) => musicPlayer.current.currentTime = e.target.value}/>
                  <p>{DateTime.fromSeconds(duration).toFormat('m:ss')}</p>
                </div>
                : null }
              </div>
            </div>
            <audio ref={musicPlayer} preload="metadata" onLoadedMetadata={() => setDuration(musicPlayer.current.duration)} onTimeUpdate={() => setTime(musicPlayer.current.currentTime)} onEnded={() => setPlay(false)} loop={looping} src={selectedMusic?.music} className='hidden'></audio>
          </div>
        </div>
      </div>
      { formState
      ? <MusicForm setState={setFormState} addNotification={addNotification}/>
      : null }
    </div>
  )
}