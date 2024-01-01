import { FaStar } from "react-icons/fa"
import '../css/ReviewCard.css';

const ReviewCard = ({user}) => {
  return (
    <div className="review-card">
      <div className="user-pic-name">
        <img src="" alt="user-pic" />
        <h6>{user? user.name: 'user-name'}</h6>
      </div>
      <p>{user? user.review: 'user-review'}</p>
      <FaStar />
      <FaStar />
      <FaStar />
      <FaStar />
      <FaStar />
    </div>
  )
}

export default ReviewCard
