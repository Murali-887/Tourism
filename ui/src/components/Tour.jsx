import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import QuickFacts from "./QuickFacts";
import TourGuides from "./TourGuides";
import { FaCalendar, FaStar } from "react-icons/fa";
import {FaArrowTrendUp, FaUser} from "react-icons/fa6";
import ReviewCard from "./ReviewCard";
import '../css/Tour.css';

const Tour = () => {
  const [tour, setTour] = useState(null);
  const {id} = useParams();
  useEffect(() => {
    try {
    axios.get(`http://localhost:4201/api/v1/tours/${id}`, {
      headers: {
        contentType: 'application/json',
        Accept: 'application/json'
      }
    }).then(data => {
      setTour(data.data.data);
      console.log(data.data.data);
    })
    } catch (e) {
      console.log(e);
    }
  }, [id])
  return (
    <main>
    {
      tour
      ?
      <div className="tour">
        {/* Tour Header */}
        {/* Tour Image */}
        <div className="tour-heading">
          <h1>{tour.name}</h1>
        </div>
        {/* Tour Description */}
        <div className="overview-about">
        <div className="overview">
        <div className="overview-1">
          <h2>Quick facts</h2>
          <QuickFacts element={<FaCalendar />} label='Next date' text={tour.startDates[0].toLocaleString('en-us', {month: 'long', year: 'numeric'})}/>
          <QuickFacts element={<FaArrowTrendUp />} label='Difficulty' text={tour.difficulty}/>
          <QuickFacts element={<FaUser />} label='Participants' text={`${tour.maxGroupSize} people`}/>
          <QuickFacts element={<FaStar />} label='Rating' text={`${tour.ratingsAverage} / 5`}/>
          </div>
          {/* Tour Guides */}          
          <div className="overview-2">
          <h2>YOUR TOUR GUIDES</h2>
          {
            tour.guides && tour.guides.length
            ? tour.guides.map(guide => <TourGuides key={guide._id} guide={guide}/>)
            : null
          }
          <TourGuides />
          <TourGuides />
          <TourGuides />
        </div>
        </div>
        <div className="about-tour">
        <h2>ABOUT {tour.name.toUpperCase()}</h2>
        {
          tour.description.split('\n').map(para =>
            <p className="tour-description" key={para}>{para}</p>
          )
        }
        </div>
        </div>
        {/** Tour Pictures */}
        {/** Tour Reviews */}
        {
          tour.reviews
          ? tour.reviews.map(review => <ReviewCard key={review._id} user={review.user} />)
          : null
        }
        <section>
        <div className="images">
        <img src="/tour-images/tour-1.jpg" alt="tour pic" width='50%' />
        <img src="/tour-images/tour-1.jpg" alt="tour pic" width='50%' />
        <img src="/tour-images/tour-1.jpg" alt="tour pic" width='50%' />
        </div>
        </section>
        <section id="tour-reviews">
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
        </section>
        <div className="tour-footer">
          <img src="/logo.png" alt="website logo" width='10%' height={'100%'} />
          <p>What are you waiting for?<br /> {`${tour.duration} days. 1 adventure. Infinite memories. Make it yours today!`}</p>
        <button>Book tour now!</button>
        </div>
      </div>
      : 'loading...'
    }
    </main>
  )
}

export default Tour