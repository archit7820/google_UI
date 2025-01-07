"use client"; // Enable client-side rendering
import { useState, useRef ,useEffect } from "react"; // Import useRef
import "./page.scss";
import Navbar from "./component/Navbar/Navbar";
import Footer from "./component/Footer/Footer";
import { useRouter } from "next/navigation";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import axios from "axios";
import AddShortcut from "./component/Shortcut/Shortcut";


export default function Home() {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const debounceTimeoutRef = useRef(null); // For debouncing fetchSuggestions

  const handleWrapperClick = () => {
    setIsDropdownOpen(true);
  
    // Add a null check before calling focus
    if (inputRef.current) {
      inputRef.current.focus();
     }
     };

     const [isImageRecognitionVisible, setImageRecognitionVisible] = useState(false);

  const handleImageScanClick = () => {
    setImageRecognitionVisible(true); // Show the image recognition section
  };

  const handleCloseImageRecognition = () => {
    setImageRecognitionVisible(false); // Hide the image recognition section
  }

  const [isDragging, setIsDragging] = useState(false); // For drag-over effect
    const [selectedImage, setSelectedImage] = useState(null);
    const router = useRouter();
  
    const handleDragEnter = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };
  
    const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        processImage(file);
      }
    };
   
 
    const [imageData, setImageData] = useState(null);
  
  
    const processImage = (file) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const imageDataUrl = reader.result;
        
        // Store image data in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('uploadedImage', imageDataUrl);
          
          // Navigate to test page
          router.push('/result');
        }
      };
      
      reader.readAsDataURL(file);
    };
    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        processImage(file);
      }
    };

  

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        processImage(file); // Process the image and send it as props
      }
    }
  
    const triggerFileInput = () => {
      document.getElementById("file-input").click();
    };


// listening  to google serach result 
   
        const startListening = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.start();
        setIsListening(true);
        recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        recognition.stop();
        setIsListening(false);

// Redirect to Google search
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(transcript)}`;
        };
        recognition.onerror = () => {
        console.error("Error recognizing speech");
        setIsListening(false);
        };
        recognition.onend = () => {
        setIsListening(false);
        };
      };
      //
// google search text 
        const handleKeyDown = (event) => {
          if (event.key === "Enter" && query.trim() !== "") {
          window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
          saveToLocalStorage(query.trim());
      setQuery(""); // Clear the input
        }
        };

      
        const handleSearch_text = () => {
          if (query.trim() !== "") {
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
          }
        };

 // url search 
 const [url, setUrl] = useState("");

  const handleSearch = () => {
    if (isValidURL(url)) {
      window.location.href = url; 
    } else {
      alert("Please enter a valid URL (e.g., https://example.com)");
    }
  };
  const isValidURL = (str) => {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  // close the dropdown 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch Suggestions
  const fetchSuggestions = async (searchQuery) => {
    try {
      const response = await fetch(`/api/proxy?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setSuggestions(data.suggestions || []); // Set suggestions array
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };
  

  
  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (value.trim()) {
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(value);
        setIsDropdownOpen(true);
      }, 300); // Debounce delay
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (value) => {
    setQuery(value); // Set the clicked suggestion's value
    setIsDropdownOpen(false);
  };
  
  const handleDeleteSuggestion = (suggestion) => {
    setSuggestions(suggestions.filter((item) => item.value !== suggestion.value));
  };
  
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
  
      <div className="home_page_google">
        <div className="google_header">
          <Navbar />
        </div>
  
        <div className="home_page_container">
          <div className="google_logo">
            <img className="icon_logo_google" src="google_logo.svg" alt="Google Logo" />
          </div>
  
  
  <div className="input_wrapper" onClick={handleWrapperClick}>
             
  
  {!isImageRecognitionVisible && (
     <div className="search_section">
     
       <img className="search_icon" src="./search_cr23.svg" alt="Search Icon" />
    <input
      type="text"
      value={query}
      onChange={handleInputChange}
     onKeyDown={handleKeyDown}
      placeholder="Search Google or type a URL"
      className="input_field_google_search"
      ref={inputRef}
    />
    <div className="search_options_google">
    <img
          className="mic_search"
          src="./mic.svg"
          alt="Mic Search"
          onClick={startListening}
          style={{ cursor: "pointer" }}
        />
        {isListening && <p>Listening...</p>}
      <img className="image_scan" src="./camera.svg"  onClick={handleImageScanClick}  alt="Image Scan" />
    </div>
  
      </div> 
      )}
     <div className="suggestion">
     {isDropdownOpen && query.trim() && (
            <div className="suggestions-dropdown">
             {suggestions.length > 0 ? (
  suggestions.map((suggestion, index) => (
    <div key={index} className="suggestion-item">
      <span onClick={() => handleSuggestionClick(suggestion.value)}>
        {suggestion.value}
      </span>
      <div
        className="delete-button"
        onClick={() => handleDeleteSuggestion(suggestion)}
      >
        Delete
      </div>
    </div>
  ))
) : (
  <div className="no-suggestions">No suggestions available.</div>
)}

            </div>
          )}
  </div>
  
  
  
  
  
  
                          {isImageRecognitionVisible && (
                            <div className="image_recognization_section"  >
                           <div className="image_search_section_1">  
                           <div className="headline_text_image_search">   Search any image with Lens</div>
                           <div className="Close_button" onClick={handleCloseImageRecognition}>
                             ✖
                            </div>
                            </div>
  
                            <div className="main_image_container_bg">
            <div
        className={`image_search_block ${isDragging ? "drag-over" : ""}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="field_image" onClick={triggerFileInput}>
          <img src="./image_search.svg" alt="Image Search" />
          <div className="text_image">
            {isDragging ? (
              <span style={{ fontWeight: "bold" }}>Drop an image here</span>
            ) : (
              <>
                Drag an image here or{" "}
                <span style={{ color: "#1967D2", cursor: "pointer"  , textDecoration : "underline"}}>
                  upload a file
                </span>
              </>
            )}
          </div>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
            style={{ display: "none" }}
          />
        </div>
       
      </div>
  
  
     
   <div className="text_link_input_andline"> 
  
  <div className="line_divide">
  
      <div className="line"></div> 
      <div className="text_line_divide">OR</div>
      <div className="line"></div>
      </div>
  
  
      <div className="text_link_input">  
    <input
    type="text"
    value={url}
    onChange={(e) => setUrl(e.target.value)}
    //onKeyDown={handleSearch}
    className="input_url_image"
     placeholder="Paste image link"/>
    <div className="search_url_image" onClick={handleSearch}>search</div>
   </div>
  
   </div>
   </div>
  
  
      </div>  )}
  
  
  </div>
  
  
  
  
  <div className="buttons_feeling_search">
    <div className="google_search"     value={query}
      //onChange={handleInputChange}
      onClick={handleSearch_text}>Google Search</div>
    <div className="feeling_lucky">I&apos;m feeling lucky </div>
  
  </div>
  
  
  
  
  
  
  
        </div>
  
      
        <div className="footer_section"><Footer/></div> 
       
      </div>
    );
  } 
         
      

      