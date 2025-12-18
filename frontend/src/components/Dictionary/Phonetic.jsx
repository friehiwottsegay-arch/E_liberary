// Phonetic.jsx

import React from 'react';
import './Phonetic.css';

const Phonetic = ({ phonetic }) => {
  const audioObj = new Audio(phonetic.audio);

  const play = (event) => {
    event.preventDefault();
    audioObj.play();
  };

  return (
    <div className="Phonetic">
      <hr />
      <h4>
        <i
          className="fas fa-play-circle play"
          onClick={play}
          tabIndex="0"
          title="Play audio of phonetic"
        ></i>{' '}
        {phonetic.text}
      </h4>
    </div>
  );
};

export default Phonetic;
