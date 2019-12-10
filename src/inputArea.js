import React from 'react';

export default function InputArea(props) {
  return (
    <div className="input-area">
      <textarea name="" id="" placeholder="Type your words here"
        value={props.inputVal}
        onChange={props.whenChange}
        onKeyPress={props.whenKeyPress}
        onBlur={props.whenFocusTrigger}
        onFocus={props.whenFocusTrigger}
        onClick={props.whenFocusTrigger}
      ></textarea>
    </div>
  )
}