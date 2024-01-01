import '../css/QuickFacts.css'
const QuickFacts = ({element, label, text}) => {
  return (
    <div className="quick-facts">
      <span>{element}</span>
      <span>{label}</span>
      <span>{text}</span>
    </div>
  )
}

export default QuickFacts
