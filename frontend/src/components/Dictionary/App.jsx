// App.jsx

import read from './images/read.svg';
import Dictionary from './Dictionary';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <div className="container">

        <header className="App-header">
          <img src={read} alt="Reading woman drawing" className="img-fluid logo" />
          <h1>Dictionary</h1>
        </header>

        <main>
          <Dictionary />
        </main>

        <footer className="mt-4 footer">
          <p className="m-0">
            This is an{' '}
            <a
              href="https://github.com/cslylla/react-dictionary"
              target="_blank"
              rel="noreferrer"
              title="Open GitHub repository"
            >
              open-sourced
            </a>{' '}
            project coded by{' '}
            <a
              href="https://www.linkedin.com/in/lilla-csanaky-a850a617/"
              target="_blank"
              rel="noreferrer"
              title="Open Lilla's LinkedIn profile"
            >
              cslylla
            </a>
          </p>
        </footer>

      </div>
    </div>
  );
};

export default App;
