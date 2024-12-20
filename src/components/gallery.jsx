import React, { useState, useEffect, useRef } from "react";
import './Gallery.css';
export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const demoImages = [
    { src: "/img/demo1.png", alt: "Demo 1" },
    { src: "/img/demo1-res.png", alt: "Demo 1 Result" },
    { src: "/img/demo2.png", alt: "Demo 2" },
    { src: "/img/demo2-res.png", alt: "Demo 2 Result" },
  ];

  const labelMap = {
    1: { name: "Breast", color: "yellow" },
    2: { name: "Missv", color: "green" },
    3: { name: "Mrp", color: "blue" },
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
    setResults(null);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    setLoading(true);

    try {
      const response = await fetch("https://safeeye-be.onrender.com/api/detect", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error detecting image");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error processing your image.");
    } finally {
      setLoading(false);
    }
  };

  const drawDetections = (boxes, classes, scores, threshold) => {
    if (!canvasRef.current || !selectedImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the uploaded image
      ctx.drawImage(img, 0, 0);

      // Draw detection results
      boxes.forEach((box, i) => {
        if (scores[i] > threshold) {
          const [yMin, xMin, yMax, xMax] = box;

          // Calculate box dimensions
          const x = xMin * img.width;
          const y = yMin * img.height;
          const width = (xMax - xMin) * img.width;
          const height = (yMax - yMin) * img.height;

          // Draw bounding box
          ctx.strokeStyle = labelMap[classes[i]]?.color || "red";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);

          // Draw label
          ctx.font = "16px Arial bold";
          ctx.fillStyle = "white";
          ctx.fillText(
            `${labelMap[classes[i]]?.name || "Unknown"} - ${Math.round(scores[i] * 100)}%`,
            x + 5,
            y - 10
          );

          // Draw censorship rectangle
          ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
          ctx.fillRect(x, y, width, height);
        }
      });
    };

    img.src = URL.createObjectURL(selectedImage);
  };

  useEffect(() => {
    if (results) {
      drawDetections(results.boxes, results.classes, results.scores, 0.6);
    }
  }, [results]);

  return (
    <div id="portfolio" className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="container text-center">
        <div className="section-title mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Image Prevention</h2>
          <p className="text-gray-600">
            We understand that children can inadvertently be exposed to adult content,
            potentially compromising the innocence of their childhood. Our mission is to
            help you safeguard and protect their purity.
          </p>
        </div>

        <div className="gallery-container">
          {demoImages.map((demo, index) => (
            <div key={index} className="gallery-item">
              <img
                src={demo.src}
                alt={demo.alt}
                className="gallery-image"
              />
            </div>
          ))}
        </div>

        {/* Upload Section */}
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md mx-auto" style={{ alignContent: 'center', justifyContent: 'center' }}>
          <h3 className="text-xl font-semibold mb-4">Upload an *NSFW* B-Image</h3>
          <div style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
            <label htmlFor="file-upload" id="file-input-label" style={{ fontSize: "22px", marginRight: 20}}>
              Choose a NSFW Image (Exp data: Mannequinn)
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="file-input"
              onChange={handleImageChange}
              style={{ border: "1px solid"}}
            /> 
          </div>
          <div id="file-input-container" style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`mt-4 w-full py-2 px-4 text-white font-bold rounded-lg ${
                loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
              }`}
              style={{ height: "50", borderRadius: "10px", color: "black" }}
              id="file-button"
            >
              {loading ? "Processing..." : "Upload and Detect"}
            </button>
          </div>
        </div>

        {selectedImage && (
          <div className="preview-container">
            <div className="preview-row">
              <div className="column">
                <h5 className="column-title">Original Image:</h5>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Original"
                  className="image-display"
                />
              </div>
              <div className="column">
                <h5 className="column-title">Processed Image:</h5>
                <canvas
                  ref={canvasRef}
                  className="image-display"
                ></canvas>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};