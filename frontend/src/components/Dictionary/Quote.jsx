// Quote.jsx

import React from 'react';
import read2 from './images/read2.svg';
import './Quote.css';

const Quote = () => {
  // Example of the random quote functionality (uncomment to use)
  /*
  const quotes = [
    "Be mindful when it comes to your words. A string of some that don't mean much to you, may stick with someone else for a lifetime.",
    "Be careful with your words. Once they are said, they can be only forgiven, not forgotten.",
    "Words are free. It's how you use them that may cost you.",
    "Raise your words, not your voice. It is rain that grows flowers, not thunder.",
    "...But the human tongue is a beast that few can master. It strains constantly to break out of its cage, and if it is not tamed, it will run wild and cause you grief.",
    // more quotes...
  ];

  const randomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

  const getQuote = () => {
    const index = randomNumber(0, quotes.length);
    return quotes[index];
  };
  */

  return (
    <div className="Quote">
      <img src={read2} alt="Reading woman drawing" className="img-fluid picture" />
      {/* Optionally display the random quote here */}
      {/* <p>{getQuote()}</p> */}
    </div>
  );
};

export default Quote;
