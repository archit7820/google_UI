'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [displayImage, setDisplayImage] = useState(null);

  useEffect(() => {
    // Retrieve image data from localStorage
    if (typeof window !== 'undefined') {
      const storedImage = localStorage.getItem('uploadedImage');
      
      if (storedImage) {
        setDisplayImage(storedImage);
        console.log('Received Image Data:', storedImage);

        // Optional: Clear the stored image after retrieval
        localStorage.removeItem('uploadedImage');
      }
    }
  }, []);

  return (
    <div>
      <h1>Image Display Page</h1>
      {displayImage && (
        <div>
          <img 
            src={displayImage} 
            alt="Uploaded" 
            style={{ maxWidth: '100%', maxHeight: '500px' }} 
          />
        </div>
      )}
    </div>
  );
}