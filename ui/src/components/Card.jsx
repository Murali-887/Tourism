import React from 'react'
import ImageText from './ImageText';
import { Link } from 'react-router-dom';

function Card({tour}) {
    return (
        <div className='tour-card'>
            <div className='tour-img'>
                <img src="/tour-images/tour-1.jpg" alt='tour_image'/>
            </div>
            <div className='tour-name'>
                <h2>{tour.name}</h2>
            </div>
            <div className='tour-summary'>
            <p>{tour.summary}</p>
            </div>
            <div className='tour-details'>
                <ImageText details='4 stops'/>
                <ImageText details='4 stops'/>
                <ImageText details='4 stops'/>
            </div>
            <div className='card-footer'>
                <div className='price-rating'>
                    <div className='price'>
                        <span><strong>${`${tour.price}`}</strong><p>per person</p></span>
                    </div>
                    <div className='rating'>
                        <span><strong>{tour.ratingsAverage}</strong><p>rating({tour.ratingsQuantity})</p></span>
                    </div>
                </div>
                <div className='details'>
                    <button><Link to={`/tour/${tour._id}`}>DETAILS</Link></button>
                </div>
            </div>
        </div>
    );
}

export default Card;