"use client"
import { useState, useRef, useEffect } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./recog.scss";

import Link from "next/link";
import Navbar_2 from "../component/Navbar_result/Navbar_2";
import Footer from "../component/Footer/Footer";

const ImageSearchWithCrop = () => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const imageRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedImage = localStorage.getItem("uploadedImage");
      if (storedImage) {
        setImage(storedImage);
      }
    }
  }, []);

  const GOOGLE_VISION_API_KEY = "AIzaSyC77QJ15pop2jx9m_FwqzW8f0ZTAW67yJ8";
  const GOOGLE_CSE_API_KEY = "AIzaSyC77QJ15pop2jx9m_FwqzW8f0ZTAW67yJ8";
  const GOOGLE_CX = "36763c8b75a36460d";

  useEffect(() => {
    if (image && imageRef.current) {
      if (cropper) {
        cropper.destroy();
      }
      const newCropper = new Cropper(imageRef.current, {
        aspectRatio: 1,
        viewMode: 2,
        autoCropArea: 0.8,
        responsive: true,
        background: false,
      });
      setCropper(newCropper);
    }
  }, [image]);

  useEffect(() => {
    if (image) {
      handleSearch(); // Run the search automatically
    }
  }, [image]);
  
  const handleCrop = () => {
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      if (croppedCanvas) {
        const croppedImageUrl = croppedCanvas.toDataURL("image/jpeg");
        setCroppedImage(croppedImageUrl);
        handleSearch(croppedImageUrl); // Automatically search after cropping
      } else {
        setError("Unable to crop the image. Please try again.");
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
      setError("Image analysis failed. Please try again.");
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
      setError("Failed to search Google Images. Please try again.");
      throw new Error("Failed to search Google Images.");
    }
  };

  const handleSearch = async (croppedImageUrl) => {
    const base64Image = croppedImageUrl
      ? croppedImageUrl.split(",")[1]
      : image?.split(",")[1];

    if (!base64Image) {
      setError("No valid image to process. Please upload or confirm the image.");
      return;
    }

    setLoading(true);
    setError("");
    setSearchResults([]);

    try {
      const query = await analyzeImage(base64Image);
      if (!query) {
        setError("No meaningful labels found in the image.");
        setLoading(false);
        return;
      }

      const results = await searchGoogleImages(query);
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="navbar_img_recog">
      <Link href="/">
          <img className="icon_logo_google" src="./google_logo.svg" alt="Logo" />
        </Link>
      <div className="navbar_img">
        <Navbar_2 />
      </div>
      <div>
        
      </div>
      <div className="image_recognisation_container">
        <div className="Image_uploadedtocrop">
          <div className="image_buttons">
           
            {image && (
              <div>
                <img
                  ref={imageRef}
                  src={image}
                  id="image-to-crop"
                  className="img_src_main"
                  alt="Crop target"
                  style={{
                    maxWidth: "100%",
                    display: "block",
                  }}
                />
              </div>
            )}
          </div>
          <div className="button_cropandsearch">
            <button className="crop_button" onClick={handleCrop}>
              Crop and Confirm
            </button>
          </div>
        </div>
        <div className="response_from_recog">
          {loading && (
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p>Processing Image...</p>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  border: "5px solid #f3f3f3", // Light gray background
                  borderTop: "5px solid #4caf50", // Green color for the progress
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite", // Add animation
                }}
              ></div>
              <style>
                {`
                  @keyframes spin {
                    0% {
                      transform: rotate(0deg);
                    }
                    100% {
                      transform: rotate(360deg);
                    }
                  }
                `}
              </style>
            </div>
          )}

          {searchResults.length > 0 && (
            <div>
             
              <div className="search-results-grid">
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
                        maxWidth: "150px",
                        height: "150px",
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
     
    </div>
  );
};

export default ImageSearchWithCrop;
