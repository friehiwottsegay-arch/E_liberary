// Photos.jsx

import React from 'react';
import './Photos.css';

const Photos = ({ photos, alt }) => {
  if (!photos) return null;

  return (
    <section className="Photos">
      <div className="row">
        {photos.map((photo, index) => (
          <div className="col-md-4" key={index}>
            <a
              href={photo.src.original}
              target="_blank"
              rel="noreferrer"
              title="Open original photo"
            >
              <img
                src={photo.src.landscape}
                className="img-fluid picture"
                alt={alt}
              />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Photos;
