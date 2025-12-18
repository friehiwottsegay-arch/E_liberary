import React, { useState, useEffect } from "react";

const SignLanguageVocabulary = () => {
  const [wordList, setWordList] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [filterLetter, setFilterLetter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/words/")
      .then((res) => res.json())
      .then((data) => {
        const enriched = data.map((w) => ({
          ...w,
          translations: {
            EN: w.word,
            AM: "Loading...",
            OR: "Loading...",
            SO: "Loading...",
            TI: "Loading...",
            SS: "Loading...",
            AR: "Loading...",
            FR: "Loading...",
            ZH: "Loading...",
          },
        }));
        setWordList(enriched);
        if (enriched.length > 0) {
          setSelectedWord(enriched[0]);
          fetchTranslations(enriched[0]);
        }
      });
  }, []);

  const translate = async (text, lang) => {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|${lang}`
      );
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      return data.responseData.translatedText || "N/A";
    } catch (err) {
      console.error(`Error translating "${text}" to ${lang}:`, err);
      return "Translation Error";
    }
  };

  const fetchTranslations = async (wordItem) => {
    const [am, or, so, ti, ss, ar, fr, zh] = await Promise.all([
      translate(wordItem.word, "am"),
      translate(wordItem.word, "om"),
      translate(wordItem.word, "so"),
      translate(wordItem.word, "ti"),
      translate(wordItem.word, "ss"),
      translate(wordItem.word, "ar"),
      translate(wordItem.word, "fr"),
      translate(wordItem.word, "zh"),
    ]);

    const updatedWord = {
      ...wordItem,
      translations: {
        EN: wordItem.word,
        AM: am,
        OR: or,
        SO: so,
        TI: ti,
        SS: ss,
        AR: ar,
        FR: fr,
        ZH: zh,
      },
    };

    setWordList((prev) =>
      prev.map((w) => (w.word === wordItem.word ? updatedWord : w))
    );
    setSelectedWord(updatedWord);
  };

  const handleSelectWord = (wordItem) => {
    setSelectedWord(wordItem);
    fetchTranslations(wordItem);
  };

  const filteredWords = wordList.filter((word) =>
    word.word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedWords = filteredWords.reduce((acc, word) => {
    const firstLetter = word.word[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(word);
    return acc;
  }, {});

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const languageNames = {
    EN: "English",
    AM: "Amharic",
    OR: "Oromo",
    SO: "Somali",
    TI: "Tigrinya",
    SS: "South Sudanese",
    AR: "Arabic",
    FR: "French",
    ZH: "Chinese",
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      {/* MOBILE VIDEO SECTION */}
      <div className="block md:hidden sticky top-0 z-50 bg-black">
        {selectedWord && (
          <video
            autoPlay
            muted
            loop
            controls
            className="w-full h-56 object-contain"
            key={selectedWord.video}
          >
            <source src={selectedWord.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* WORD LIST SECTION */}
      <div className="order-2 md:order-1 w-full md:w-1/4 p-4 bg-white dark:bg-gray-800 border-t md:border-r border-gray-200 dark:border-gray-700 flex flex-col space-y-4 md:max-h-screen">
        <input
          type="text"
          placeholder="Search Here"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white dark:bg-gray-700 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-lg shadow">
          Word List
        </div>

        {/* Scrollable Word List on Mobile */}
        <div className="overflow-y-auto flex-1 text-sm">
          {alphabet.map((letter) => {
            if (filterLetter && letter !== filterLetter) return null;
            return (
              groupedWords[letter] && (
                <div key={letter}>
                  <div className="text-gray-600 dark:text-gray-300 font-semibold mt-4 mb-1">{letter}</div>
                  {groupedWords[letter].map((item, idx) => (
                    <div
                      key={idx}
                      className={`px-3 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 rounded ${
                        selectedWord?.word === item.word ? "bg-blue-600 text-white font-bold" : ""
                      }`}
                      onClick={() => handleSelectWord(item)}
                    >
                      {item.word}
                    </div>
                  ))}
                </div>
              )
            );
          })}
        </div>

        <div className="pt-4 border-t mt-4 hidden md:block">
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-blue-700 dark:text-blue-400 font-medium">
            {alphabet.map((letter) => (
              <button
                key={letter}
                className={`px-1 py-1 rounded ${
                  filterLetter === letter ? "bg-blue-600 text-white" : "hover:bg-blue-100 dark:hover:bg-blue-700"
                }`}
                onClick={() => setFilterLetter(filterLetter === letter ? null : letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP VIDEO + IMAGE */}
      <div className="order-1 md:order-2 w-full md:w-2/4 p-4 bg-gray-50 dark:bg-gray-900 flex flex-col items-center space-y-4 hidden md:flex">
        {selectedWord && (
          <>
            <div className="w-full max-w-xl bg-black shadow-lg rounded-lg overflow-hidden">
              <video
                autoPlay
                muted
                loop
                controls
                className="w-full h-60 sm:h-72 md:h-80 bg-black"
                key={selectedWord.video}
              >
                <source src={selectedWord.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="w-full max-w-xl bg-white rounded-lg shadow p-4">
              <img
                src={selectedWord.image}
                alt={`${selectedWord.word} sign`}
                className="w-full h-48 object-contain"
              />
            </div>
            <div className="mt-2 text-blue-700 dark:text-blue-400 font-bold text-lg">
              Word #{wordList.indexOf(selectedWord) + 1} of {wordList.length}
            </div>
          </>
        )}
      </div>

      {/* TERM DETAILS */}
      <div className="order-3 md:order-3 w-full md:w-1/4 p-6 bg-white dark:bg-gray-800 border-t md:border-l border-gray-200 dark:border-gray-700 space-y-6">
        <h2 className="text-blue-700 dark:text-blue-400 text-xl font-semibold mb-4">Selected Term</h2>
        {selectedWord && (
          <>
            <div className="space-y-3 text-sm">
              {["EN", "AM", "OR", "SO", "TI", "SS", "AR", "FR", "ZH"].map((lang) => (
                <div key={lang} className="flex items-center space-x-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">{lang}</span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedWord.translations?.[lang] || "Loading..."}</span>
                  <span className="text-gray-500">{languageNames[lang]}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm">
              <h3 className="text-blue-700 dark:text-blue-400 font-semibold">Sign Language Symbol:</h3>
              <div className="space-x-2 mt-2 text-2xl">
                <span role="img" aria-label="sign1">🦾</span>
                <span role="img" aria-label="sign2">✋</span>
                <span role="img" aria-label="sign3">🤟</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignLanguageVocabulary;
