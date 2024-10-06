import React, { useState, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import './featuredProperties.css';

const FeaturedProperties = () => {
  const { data, loading, error } = useFetch("/hotels?featured=true&limit=4");
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (data) {
      setProperties(data);
    }
  }, [data]);

  return (
    <div className="fp">
      {loading ? (
        "Loading..."
      ) : (
        <>
          {properties.length > 0 ? (
            properties.map((item, index) => (
              <div className={`fpItem fpItem${index + 1}`} key={item._id}>
                <img
                  src={item.photos.length > 0 ? item.photos[0] : "fallback-image-url.jpg"}
                  alt={item.name}
                  className="fpImg"
                />
                <span className="fpName">{item.name}</span>
                <span className="fpCity">{item.city}</span>
                <span className="fpPrice">Starting from ${item.cheapestPrice}</span>
                {item.rating && (
                  <div className="fpRating">
                    <button>{item.rating}</button>
                    <span>Excellent</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No properties found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default FeaturedProperties;

