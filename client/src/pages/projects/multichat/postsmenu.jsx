import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DateTime } from 'luxon';

import axios from 'axios';

import Avatar from './components/avatar/avatar.jsx';

import likeIcon from './assets/images/like.png';
import dislikeIcon from './assets/images/dislike.png';
import editIcon from './assets/images/edit2.png';
import deleteIcon from './assets/images/delete.png';

function PostObj({ post, socket }) {
  const [isEdit, setEditMode] = useState(false)
  const [editInput, setEditInput] = useState(post.post)

  const account = useSelector((state) => state.auth.account)

  function editPost() {
    setEditMode(false)
    if (editInput == post.post) return

    socket.emit('editPost', { requester: account.id, postId: post._id, edit: editInput })
  }

  function deletePost() {
    socket.emit('deletePost', { requester: account.id, postId: post._id })
  }

  function reactToPost(type) {
    socket.emit('reactPost', { requester: account.id, postId: post._id, react: type })
  }

  return (
    <div className='border-2 border-gray-500 rounded-xl grid grid-rows-[auto,auto,auto]'>
      <div className='p-2 border-b-2 border-gray-500 flex items-center gap-2'>
        <Avatar className='w-14 h-14' id={post.poster[0]}/>
        <div>
          <p className='font-bold text-2xl'>{post.poster[1]}</p>
          <p className='font-medium text-gray-500'>{DateTime.fromISO(post.dateCreated).toFormat('MMM dd, HH:mm')}</p>
        </div>
        { !isEdit && account.id == post.poster[0] ?
        <div className='flex ml-auto'>
          <button className='border-2 border-r-0 border-gray-500 rounded-l-lg transition-all ease-in-out hover:bg-yellow-500' onClick={() => setEditMode(true)}>
            <img className='p-1 w-8 h-8' src={editIcon}/>
          </button>
          <button className='border-2 border-gray-500 rounded-r-lg transition-all ease-in-out hover:bg-red-500' onClick={() => deletePost()}>
            <img className='p-1 w-8 h-8' src={deleteIcon}/>
          </button>
        </div>
        : null }
      </div>
      <div className='p-2 border-b-2 border-gray-500'>
        { !isEdit
        ? 
        <div>
          <p className='text-xl whitespace-pre-line'>{post.post}</p>
          { post.edited[0] ? <p className='font-medium text-gray-500 italic'>(Edited {DateTime.fromISO(post.edited[1]).toFormat('MMM dd, HH:mm')})</p> : null }
        </div>
        : 
        <div className='grid gap-2'>
          <textarea className='p-2 bg-transparent border border-gray-500 rounded-md outline-none' value={editInput} onChange={e => setEditInput(e.target.value)}/>
          <div className='grid grid-cols-2 gap-1'>
            <button className='p-1 border-2 border-indigo-500 rounded-l-lg font-medium transition-all ease-in-out hover:bg-indigo-600' onClick={() => editPost()}>Save</button>
            <button className='p-1 border-2 border-red-500 rounded-r-lg font-medium transition-all ease-in-out hover:bg-red-600' onClick={() => setEditMode(false)}>Discard</button>
          </div>
        </div>
        }
      </div>
      <div className='p-2'>
        <div className='flex items-center'>
          <button className={`group px-2 py-1 border-2 border-r-0 border-gray-500 rounded-s-lg flex items-center gap-2 transition-all ease-in-out hover:bg-green-700 ${post.reactions.likes[1] ? 'bg-green-700' : 'bg-transparent'}`} onClick={() => reactToPost('like')}>
            <p className='font-medium text-xl'>{post.reactions.likes[0]}</p>
            <img className='w-6 h-6 transition-all ease-in-out group-hover:scale-[1.15]' src={likeIcon}/>
          </button>
          <button className={`group px-2 py-1 border-2 border-gray-500 rounded-e-lg flex items-center gap-2 transition-all ease-in-out hover:bg-red-700 ${post.reactions.dislikes[1] ? 'bg-red-700' : 'bg-transparent'}`} onClick={() => reactToPost('dislike')}>
            <p className='font-medium text-xl'>{post.reactions.dislikes[0]}</p>
            <img className='w-6 h-6 transition-all ease-in-out group-hover:scale-[1.15]' src={dislikeIcon}/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PostsMenu({ socket }) {
  const [postList, setPostList] = useState([])
  const [postInput, setPostInput] = useState('')

  const account = useSelector((state) => state.auth.account)

  function getPosts() {
    axios.get('/api', { params: { type: 'getPosts' } })
    .then(res => { 
      const result = res.data
      if (result.code == 'success') setPostList(result.posts)
    })
    .catch(err => console.log(err))
  }

  function createPost() {
    socket.emit('createPost', { requester: account.id, post: postInput })
    setPostInput('')
  }

  useEffect(() => {
    getPosts()

    socket.on('createPost', (data) => {
      setPostList(current => [...current, data])
    })

    return () => { socket.off('createPost') }
  }, [])

  useEffect(() => {
    socket.on('reactPost', (data) => {
      const newInfo = postList.map((item, index) => {
        if (item._id == data._id) { item.reactions = data.reactions }
        return item
      })

      setPostList(newInfo)
    })

    socket.on('editPost', (data) => {
      const newInfo = postList.map((item, index) => {
        if (item._id == data._id) { 
          item.post = data.post
          item.edited = data.edited
        }
        return item
      })

      setPostList(newInfo)
    })

    socket.on('deletePost', (data) => {
      const newInfo = [...postList]

      let index = newInfo.findIndex(x => x._id == data._id)

      if (index !== -1) {
        newInfo.splice(index, 1)
        setPostList(newInfo)
      }
    })

    return () => {
      socket.off('editPost')
      socket.off('deletePost')
      socket.off('reactPost') 
    }
  }, [postList])

  return (
    <div className='bg-[#2d3034] px-24 py-4 grid grid-rows-[auto,1fr] gap-2'>
      <div className='p-2 border-2 border-gray-500 rounded-xl grid gap-2'>
        <p className='font-bold text-xl'>Describe today's day:</p>
        <textarea className='p-2 bg-transparent border border-gray-500 rounded-md outline-none' value={postInput} onChange={e => setPostInput(e.target.value)}/>
        <button className='py-1 border-2 disabled:border-zinc-600 enabled:border-indigo-500 rounded-md font-medium disabled:text-lg enabled:text-xl transition-all ease-in-out enabled:hover:bg-indigo-600' disabled={postInput.length < 20} onClick={() => createPost()}>{ postInput.length >= 20 ? 'Create Post' : 'Minimum 20 characters' }</button>
      </div>
      <div className='flex flex-col gap-4 overflow-auto'>
        { [...postList].reverse().map((item, index) => {
          return <PostObj key={index} post={item} socket={socket}/>
        })}
      </div>
    </div>
  )
}