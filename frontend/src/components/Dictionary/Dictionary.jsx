// Dictionary.jsx

import React, { useState } from 'react';
import axios from 'axios';
import Results from './Results';
import Quote from './Quote';

import './Dictionary.css';

const Dictionary = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [photos, setPhotos] = useState(null);

  const handleDictionaryResponse = (response) => {
    setResults(response.data[0]);
  };

  const handlePexelsResponse = (response) => {
    setPhotos(response.data.photos);
  };

  const search = () => {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en_US/${keyword}`;
    axios.get(apiUrl).then(handleDictionaryResponse);

    const pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY || '';
    const pexelsApiUrl = `https://api.pexels.com/v1/search?query=${keyword}&per_page=9`;
    const headers = pexelsApiKey ? { Authorization: `Bearer ${pexelsApiKey}` } : null;

    if (headers) {
      axios.get(pexelsApiUrl, { headers }).then(handlePexelsResponse).catch(() => setPhotos(null));
    } else {
      setPhotos(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoaded(true);
    search();
  };

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  return (
    <div className="Dictionary">
      <section>
        <h2>What word do you want to look up?</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-8">
              <input
                type="search"
                autoFocus
                autoComplete="off"
                placeholder="Search for a word"
                onChange={handleKeywordChange}
                className="searchBar"
              />
            </div>
            <div className="col-md-4">
              <input
                type="submit"
                value="Search"
                className="searchButton"
                title="Search"
              />
            </div>
          </div>
        </form>
      </section>

      {loaded ? (
        <Results results={results} photos={photos} alt={keyword} />
      ) : (
        <Quote />
      )}
    </div>
  );
};

export default Dictionary;
