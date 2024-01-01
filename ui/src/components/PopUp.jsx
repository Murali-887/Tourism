import '../css/PopUp.css';
const PopUp = ({message, setMessage, color}) => {
  if(message) setTimeout(() => setMessage(null), 3000);
  return (
    <div>
      {
        message
        ?<div className='pop-up' style={{backgroundColor: color, display: 'block'}}> {message} </div>
        : null
      }
    </div>
  )
}

export default PopUp
