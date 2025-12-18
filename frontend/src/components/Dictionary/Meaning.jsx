// Meaning.jsx

import React from 'react';
import Synonyms from './Synonyms';
import './Meaning.css';

const Meaning = ({ meaning }) => {
  return (
    <div className="Meaning">
      <h4>
        <strong>{meaning.partOfSpeech}</strong>
      </h4>

      {meaning.definitions.map((definition, index) => (
        <div key={index}>
          <hr />
          <p>
            <strong>Definition: </strong>
            {definition.definition}
          </p>
          {definition.example && (
            <p>
              <strong>Example: </strong>
              <em>{definition.example}</em>
            </p>
          )}
          <Synonyms synonyms={definition.synonyms} />
        </div>
      ))}
    </div>
  );
};

export default Meaning;
