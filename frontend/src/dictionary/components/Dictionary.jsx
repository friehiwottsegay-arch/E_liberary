import React, { useState, useEffect } from "react";
import axios from "axios";
import Results from "./Results";
import Photos from "./Photos";
import PropTypes from "prop-types";
import "../styles/Dictionary.css";

const Dictionary = ({ defaultKeyword }) => {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [results, setResults] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [learnerVocab, setLearnerVocab] = useState(() => {
    try {
      const raw = localStorage.getItem("learnerVocab");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const search = () => {
      const dictionaryApiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`;
  // Vite exposes env vars via import.meta.env. Use VITE_PEXELS_API_KEY.
  const pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY || "";
  const pexelsApiUrl = `https://api.pexels.com/v1/search?query=${keyword}&per_page=9`;
  const pexelsApiHeaders = pexelsApiKey ? { Authorization: `Bearer ${pexelsApiKey}` } : null;

      axios
        .get(dictionaryApiUrl)
        .then(handleDictionaryResponse)
        .catch((error) => {
          console.error("Error fetching dictionary data:", error);
        });
      if (pexelsApiHeaders) {
        axios
          .get(pexelsApiUrl, { headers: pexelsApiHeaders })
          .then(handlePexelsResponse)
          .catch((error) => {
            console.error("Error fetching photos:", error);
          });
      } else {
        // API key missing — skip photo request to avoid 401/undefined header issues
        setPhotos(null);
      }
    };

    if (!loaded) {
      search();
      setLoaded(true);
    }
  }, [keyword, loaded]);

  const handlePexelsResponse = (response) => {
    setPhotos(response.data.photos);
  };

  const handleDictionaryResponse = (response) => {
    setResults(response.data[0]);
  };

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoaded(false);
  };

  // Learner vocabulary helpers
  const saveLearnerVocab = (items) => {
    setLearnerVocab(items);
    try {
      localStorage.setItem("learnerVocab", JSON.stringify(items));
    } catch {}
  };

  const addToVocab = (wordObj) => {
    // avoid duplicates by word
    const exists = learnerVocab.find((w) => w.word === wordObj.word);
    if (exists) return;
    const next = [wordObj, ...learnerVocab].slice(0, 200); // keep a reasonable cap
    saveLearnerVocab(next);
  };

  const removeFromVocab = (word) => {
    const next = learnerVocab.filter((w) => w.word !== word);
    saveLearnerVocab(next);
  };

  return (
    <div className="Dictionary">
      <section>
        <div className="subheading">What word piques your interest?</div>
        <form onSubmit={handleSubmit}>
          <input
            className="search"
            type="search"
            name="keyword"
            onChange={handleKeywordChange}
            placeholder={defaultKeyword}
          />
          <input type="submit" value="Search" className="search-button" />
        </form>
        <div className="suggestions">
          Suggested concepts: cat, tree, code, sun...
        </div>
      </section>
      {results && <Results results={results} addToVocab={addToVocab} learnerVocab={learnerVocab} />}
      {photos && <Photos photos={photos} />}

      {/* Learner vocabulary panel */}
      <aside className="learner-vocab" style={{ marginTop: 20 }}>
        <h3>Your vocabulary</h3>
        {learnerVocab.length === 0 ? (
          <div className="muted">No saved words yet — click "Save" on a result to keep it here.</div>
        ) : (
          <ul>
            {learnerVocab.map((w) => (
              <li key={w.word} style={{ marginBottom: 10 }}>
                <strong>{w.word}</strong>
                <div style={{ display: "inline-block", marginLeft: 8 }}>
                  {/* play first available audio */}
                  {w.phonetics && w.phonetics.audio && (
                    <button onClick={() => new Audio(w.phonetics.audio).play()} style={{ marginRight: 8 }}>
                      ▶
                    </button>
                  )}
                  <button onClick={() => removeFromVocab(w.word)}>Remove</button>
                </div>
                {w.phonetics && w.phonetics.text && (
                  <div className="muted">{w.phonetics.text}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
};

Dictionary.propTypes = {
  defaultKeyword: PropTypes.string.isRequired,
};

export default Dictionary;
