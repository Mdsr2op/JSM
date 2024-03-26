
import { useGetUser, useLikePost, useSavePost, useUnsavePost } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite"
import { useEffect, useState } from "react"
import Loader from "./Loader"

type PostProps = {
    post: Models.Document,
    userId: string
}
const PostStats = ({post, userId}:PostProps) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id)
  const [likes, setLikes] = useState<string[]>(likesList)
  const [isSaved, setIsSaved] = useState(false)

  const {mutate: likePost} = useLikePost();
  const {mutate: savePost, isPending: isSaving} = useSavePost();
  const {mutate: unsavePost, isPending: isUnsaving} = useUnsavePost();

  const {data: currentUser} = useGetUser();
  const saveRecord = currentUser?.saves.find((save:Models.Document) => save.posts.$id === post.$id)
  
  useEffect(() =>{
    setIsSaved(!!saveRecord)
  }, [currentUser])

  const handleLike = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();

    let likesList = [...likes]
    
    if(likesList.includes(userId)){
      likesList = likesList.filter((id: string) => {
        return id !== userId
      })
    }else{
      likesList.push(userId)
    }
    setLikes(likesList)
    likePost({postId: post.$id, likesList})
  }

  const checkLiked = (userId: string, likesList: string[]) => likesList.includes(userId)

  const handleSave = ( e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if(saveRecord){
      setIsSaved(false)
      return unsavePost(saveRecord.$id)
       
    }
    setIsSaved(true)
    console.log(post.$id)
    console.log(userId)
    savePost({postId: post.$id, userId: userId})
  }

  return (
    <div className="flex justify-between items-center z-20">
        <div className="flex gap-2 mr-5">
            <img src={checkLiked(userId, likes) ? "/assets/icons/liked.svg":
            "/assets/icons/like.svg"}
             alt="like"
             width={20}
             height={20}
             onClick={(e) => {handleLike(e)}}
             className="cursor_pointer" />
             <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>

        <div className="flex gap-2">
          {isSaving || isUnsaving ? (<Loader />): (
            <img src={isSaved? "/assets/icons/saved.svg": "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            onClick={(e)=>{ handleSave(e) }}
            className="cursor_pointer" />
          )}

        </div>
    </div>
  )
}

export default PostStats