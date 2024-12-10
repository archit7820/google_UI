

  import React, { useEffect, useState } from "react";
  import Cropper from "cropperjs";
  import axios from "axios";
  
  const ImageSearchWithCrop = ({ uploadedImage }) => {
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [cropper, setCropper] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [progress, setProgress] = useState(0);
  
  // Google API placeholders
  const GOOGLE_VISION_API_KEY = "AIzaSyC77QJ15pop2jx9m_FwqzW8f0ZTAW67yJ8";
  const GOOGLE_CSE_API_KEY = "AIzaSyC77QJ15pop2jx9m_FwqzW8f0ZTAW67yJ8";
  const GOOGLE_CX = "36763c8b75a36460d";
    useEffect(() => {
      if (uploadedImage) {
        setImage(uploadedImage);
        initCropper(uploadedImage);
      }
    }, [uploadedImage]);
  
    const initCropper = (imageSrc) => {
      const imageElement = document.getElementById("image-to-crop");
      if (imageElement) {
        if (cropper) {
          cropper.destroy();
        }
        imageElement.src = imageSrc;
        const newCropper = new Cropper(imageElement, {
          aspectRatio: 1,
          viewMode: 2,
        });
        setCropper(newCropper);
      }
    };
  
    const handleCrop = () => {
      if (cropper) {
        const croppedCanvas = cropper.getCroppedCanvas();
        if (croppedCanvas) {
          setCroppedImage(croppedCanvas.toDataURL("image/jpeg"));
          console.log("Image cropped successfully!");
        } else {
          console.warn("Cropping failed, using the full image instead.");
          setCroppedImage(image); // Fallback to full image
        }
      }
    };
  
    const analyzeImage = async (base64Image) => {
      try {
        const response = await axios.post(
          `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
          {
            requests: [
              {
                image: { content: base64Image },
                features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
              },
            ],
          }
        );
  
        const labels =
          response.data.responses[0]?.labelAnnotations?.map(
            (label) => label.description
          ) || [];
        return labels.join(", ");
      } catch (err) {
        console.error("Error analyzing image:", err);
        throw new Error("Image analysis failed.");
      }
    };
  
    const searchGoogleImages = async (query) => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/customsearch/v1`,
          {
            params: {
              key: GOOGLE_CSE_API_KEY,
              cx: GOOGLE_CX,
              q: query,
              searchType: "image",
              num: 10,
            },
          }
        );
        return response.data.items || [];
      } catch (err) {
        console.error("Error fetching search results:", err);
        throw new Error("Failed to search Google Images.");
      }
    };
  
    const handleSearch = async () => {
      const base64Image = croppedImage
        ? croppedImage.split(",")[1] // Cropped image
        : image.split(",")[1]; // Fallback to original image
  
      if (!base64Image) {
        setError("No valid image to process. Please upload or confirm the image.");
        return;
      }
  
      setLoading(true);
      setError("");
      setSearchResults([]);
      setProgress(0);
  
      try {
        // Show progress bar animation
        const interval = setInterval(() => {
          setProgress((prev) => (prev < 100 ? prev + 10 : prev));
        }, 300);
  
        // Analyze image for search query
        const query = await analyzeImage(base64Image);
  
        if (!query) {
          setError("No meaningful labels found in the image.");
          setLoading(false);
          return;
        }
  
        // Perform Google Image Search
        const results = await searchGoogleImages(query);
        setSearchResults(results);
        clearInterval(interval);
        setProgress(100);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div style={{ textAlign: "center", margin: "20px" }}>
        <h2>Search Similar Images</h2>
        {image && (
          <div style={{ margin: "20px 0" }}>
            <img
              id="image-to-crop"
              alt="Crop target"
              style={{ maxWidth: "100%", display: image ? "block" : "none" }}
            />
          </div>
        )}
        <button onClick={handleCrop} style={{ marginRight: "10px" }}>
          Crop and Confirm
        </button>
        <button onClick={handleSearch}>Search</button>
  
        {loading && (
          <div style={{ marginTop: "20px" }}>
            <p>Processing Image...</p>
            <div
              style={{
                width: "100%",
                backgroundColor: "#f3f3f3",
                borderRadius: "10px",
                height: "20px",
                margin: "10px 0",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#4caf50",
                  height: "100%",
                  borderRadius: "10px",
                }}
              />
            </div>
          </div>
        )}
  
        {error && <p style={{ color: "red" }}>{error}</p>}
  
        {searchResults.length > 0 && (
          <div>
            <h3>Search Results:</h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {searchResults.map((result, index) => (
                <a
                  key={index}
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={result.link}
                    alt={result.title}
                    style={{
                      width: "200px",
                      height: "200px",
                      margin: "10px",
                      boxShadow: "0 0 10px rgba(255, 223, 0, 0.8)",
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default ImageSearchWithCrop;
  