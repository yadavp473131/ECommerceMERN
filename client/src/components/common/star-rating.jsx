import React from 'react'
import { Button } from '../ui/button'
import { StarIcon } from 'lucide-react'

const StarRatingComponent = ({rating, handleRatingChange}) => {
 
  return (
   [1,2,3,4,5].map(star=> <Button className={`p-2 rounded-full transition-colors ${star <= rating ?
    'text-yellow-500 hover:bg-black': 'bg-amber-50 hover:bg-slate-800'}`} onClick={handleRatingChange ? ()=> { handleRatingChange(star) ;  }: null} key={star} size="icon" variant="outline">
    <StarIcon className={`w-6 h-6 ${ star <= rating ? 'fill-yellow-500': "fill-black"}`}/>
   </Button>)
  )
}

export default StarRatingComponent;
