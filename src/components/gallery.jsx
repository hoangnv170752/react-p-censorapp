import React, { useState } from "react";

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
    setResults(null); // Clear previous results
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

  return (
    <div id="portfolio" className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="container text-center">
        <div className="section-title mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Image Prevention
          </h2>
          <p className="text-gray-600">
            We understand that children can inadvertently be exposed to adult
            content, potentially compromising the innocence of their childhood.
            Our mission is to help you safeguard and protect their purity.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-4">Upload an Image</h3>
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
          >
            {loading ? "Processing..." : "Upload and Detect"}
          </button>
          {selectedImage && (
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-800 mb-2">Preview:</h4>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                className="max-w-full h-auto border border-gray-200 rounded-lg mx-auto"
              />
            </div>
          )}
          {results && (
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-800 mb-2">Results:</h4>
              <pre className="bg-gray-100 p-4 rounded-lg text-left text-sm text-gray-700 overflow-auto">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};