import React from "react";
import Meaning from "./Meaning";
import Phonetic from "./Phonetic";
import "../styles/Results.css";

const Results = ({ results, addToVocab, learnerVocab }) => {
  if (!results) {
    return null;
  }

  const { word, phonetics, meanings } = results;

  const isSaved = learnerVocab && learnerVocab.some((w) => w.word === word);

  const handleSave = () => {
    if (!addToVocab) return;
    // pick a primary phonetic (prefer one with audio)
    let primary = null;
    if (Array.isArray(phonetics) && phonetics.length > 0) {
      primary = phonetics.find((p) => p.audio) || phonetics[0];
    }
    const shortMeanings = Array.isArray(meanings)
      ? meanings.map((m) => ({ partOfSpeech: m.partOfSpeech, definitions: m.definitions?.slice(0, 2) }))
      : [];
    addToVocab({ word, phonetics: primary, meanings: shortMeanings });
  };

  return (
    <div className="Results">
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ margin: 0 }}>{word}</h2>
          {addToVocab && (
            <button onClick={handleSave} disabled={isSaved} style={{ padding: '6px 10px', borderRadius: 8 }}>
              {isSaved ? 'Saved' : 'Save'}
            </button>
          )}
        </div>
        {phonetics.map((phonetic, index) => (
          <div key={index}>
            <Phonetic phonetics={phonetic} />
          </div>
        ))}
      </section>
      {meanings.map((meaning, index) => (
        <div key={index}>
          <Meaning meanings={meaning} />
        </div>
      ))}
    </div>
  );
};

export default Results;
