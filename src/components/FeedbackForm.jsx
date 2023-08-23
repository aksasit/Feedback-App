import { useState , useContext, useEffect } from 'react'
import Card from './shared/Card'
import Button from './shared/Button'
import RatingSelect from './RatingSelect'
import FeedbackContext from './context/FeedbackContext'

function FeedbackForm() {
  const [text, setText] = useState('')
  const [rating, setRating] = useState(10)
  const [btnDisabled, setBtnDisabled] = useState(true)
  const [message, setMessage] = useState('')

  const { addFeedback, feedbackEdit, updateFeedback } = useContext(FeedbackContext)

  useEffect(() => {
    if(feedbackEdit.edit === true){
      setBtnDisabled(false)
      setText(feedbackEdit.item.text)
      setRating(feedbackEdit.item.rating)
    }
  }, [feedbackEdit])

  // NOTE: This should be checking input value not state as state won't be the updated value until the next render of the component
  const handleTextChange = ({ target: {value} }) => {
    if(text === ''){
        setBtnDisabled(true)
        setMessage(null)
    }else if(text !== '' && text.trim().length < 10){
        setBtnDisabled(true)
        setMessage('Text must be at leat 10 characters')
    }else{
        setBtnDisabled(false)
        setMessage(null)        
    }  
    setText(value)  
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(text.trim().length > 10){
      const newFeedback = {
        text,
        rating
      }
      if(feedbackEdit.edit === true){
        updateFeedback(feedbackEdit.item.id, newFeedback)
      } else{
        addFeedback(newFeedback)        
      }

      // NOTE: reset to default state after submission
      setBtnDisabled(true) // add this line to reset disabled
      setRating(10) // add this line to set rating back to 10
      setText('')
    }
  }

  // NOTE: pass selected to RatingSelect so we don't need local duplicate state
  return (
    <Card>
      <form onSubmit = {handleSubmit}>
        <h2>How Would you rate your service with us?</h2>
        <RatingSelect select={setRating} selected={rating} />
        <div className="input-group">
            <input 
              onChange={handleTextChange} 
              type='text' 
              placeholder='Write a review' 
              value ={text}
            />
            <Button type='submit' isDisabled={btnDisabled}>
                Send
            </Button>
        </div>
        {message  && <div className='message'> {message} </div> }
      </form>
    </Card>
  )
}

export default FeedbackForm
