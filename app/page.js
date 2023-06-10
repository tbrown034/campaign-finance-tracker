"use client";
import { useState } from "react";
import { getData } from "./utils/API.jsx";

export default function Home() {
  const [data, setData] = useState(null);
  const [state, setState] = useState(""); // New state for storing user input for state
  const [year, setYear] = useState(""); // New state for storing user input for year

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await getData(state, year); // Pass state and year to getData function
    setData(response.results); // Store only results array in state
  };

  return (
    <main className="flex flex-col justify-center min-h-screen px-4 bg-gradient-to-t from-red-800 to-blue-800 text-cyan-100">
      <h1 className="text-4xl">PolitiChart</h1>
      <h3>
        Campaign finance tracking made easy by visualizing money in politics
      </h3>
      <input
        type="text"
        placeholder="Enter State"
        onChange={(e) => setState(e.target.value)}
      />{" "}
      <input
        type="text"
        placeholder="Enter Year"
        onChange={(e) => setYear(e.target.value)}
      />{" "}
      <button onClick={handleSubmit}>Get Data</button>
      {/* Display the names and parties of the candidates */}
      {data &&
        data.map((result, index) => (
          <div key={index}>
            <h1>results</h1>
            <h2>{result.name}</h2>
            <p>{result.party}</p>
          </div>
        ))}
    </main>
  );
}
