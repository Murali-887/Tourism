import '../css/TourGuides.css';
const TourGuides = ({guide}) => {
  return (
    <div className="tour-guides">
    <span><img src="" alt="tour-guide-pic" /></span>
    <span>{guide && guide.role === 'lead-guide'? 'Lead Guide': 'Guide'}</span>
    </div>
  )
}

export default TourGuides
