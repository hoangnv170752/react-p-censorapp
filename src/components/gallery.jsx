import React, { useState, useEffect, useRef } from "react";

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const labelMap = {
    1: { name: "Breast", color: "yellow" },
    2: { name: "Missv", color: "green" },
    3: { name: "Mrp", color: "blue" },
  };

  // Handle image selection
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
    setResults(null); // Clear previous results
  };

  // Upload image and fetch detection results
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

  // Draw detections on the canvas
  const drawDetections = (boxes, classes, scores, threshold) => {
    if (!canvasRef.current || !selectedImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Set canvas dimensions
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

  // Redraw canvas whenever results change
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
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Upload an *NSFW* B-Image</h2>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            onChange={handleImageChange}
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`mt-4 w-full py-2 px-4 text-white font-bold rounded-lg ${
              loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
            style={{ backgroundColor: "red", color: "white", height: "50", borderRadius: "10px" }}
          >
            {loading ? "Processing..." : "Upload and Detect"}
          </button>
        </div>
        {selectedImage && (
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-800 mb-2">Preview:</h4>
            <canvas
              ref={canvasRef}
              className="border border-gray-200 rounded-lg mx-auto"
            ></canvas>
          </div>
        )}
        {/* {results && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg text-left text-sm text-gray-700 overflow-auto">
            <h4 className="text-lg font-medium text-gray-800 mb-2">Detection Results:</h4>
            <pre>{JSON.stringify(results, null, 2)}</pre>
          </div>
        )} */}
      </div>
    </div>
  );
};