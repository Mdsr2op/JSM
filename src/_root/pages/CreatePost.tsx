import PostForm from '@/components/forms/PostForm'
import React from 'react'

const CreatePost = () => {
  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className='max-w-5xl flex-start gap-3 w-full'>
          <img src="/assets/icons/add-post.svg"
          alt="create-post-icon"
          height={36}
          width={36} />
          <h1 className='h3-bold md:h2-bold text-left w-full'>Create Post</h1>
        </div>
        <PostForm />
      </div>
    </div>
  )
}

export default CreatePost