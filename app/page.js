"use client";
"use strict";
import React, { useState } from "react";
import {
  searchCandidates,
  getCandidateDetails,
  getCandidateFundraisingTotal,
} from "./utils/API.jsx";

export default function Home() {
  const [candidates, setCandidates] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [fundraisingTotal, setFundraisingTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await searchCandidates(candidateName);
      setCandidates(searchResults);
    } catch (error) {
      setError("Failed to fetch search candidate data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCandidate = async (candidateId) => {
    if (candidateId) {
      setIsLoading(true);
      setError(null);

      try {
        const candidateDetails = await getCandidateDetails(candidateId);
        const fundraisingDetails = await getCandidateFundraisingTotal(
          candidateId
        );

        setSelectedCandidate(candidateDetails);
        setFundraisingTotal(fundraisingDetails);
      } catch (error) {
        setError("Failed to fetch candidate details or fundraising total data");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setCandidates([]);
    setSelectedCandidate(null);
    setFundraisingTotal(null);
    setCandidateName("");
  };

  return (
    <main className="flex flex-col justify-center min-h-screen gap-8 px-4 bg-gradient-to-t from-red-800 to-blue-800 text-cyan-100">
      <div className="text-center">
        <h1 className="text-4xl">PolitiChart</h1>
        <h3>
          Campaign finance tracking made easy by visualizing money in politics
        </h3>
      </div>
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          placeholder="Enter candidate name"
          className="w-1/2 p-2 text-black rounded-lg focus:outline-none"
        />
        <button
          type="submit"
          className="w-1/2 px-4 py-2 font-semibold text-white bg-gradient-to-r from-red-600 to-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-blue-700 active:bg-blue-800"
        >
          Search
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && (
        <>
          {candidates.map((candidate, index) => (
            <div
              key={index}
              onClick={() => handleSelectCandidate(candidate.id)}
              className="p-4 rounded-lg cursor-pointer hover:bg-blue-100 focus:bg-blue-100 active:bg-blue-200"
              style={{
                backgroundColor: candidate.party === "REP" ? "red" : "blue",
              }}
            >
              <h2>{candidate.name.split(",").reverse().join(" ").trim()}</h2>
              <p>{candidate.party}</p>
            </div>
          ))}
          {selectedCandidate && (
            <h2 className="mt-4 text-2xl font-semibold">
              {selectedCandidate.name.split(",").reverse().join(" ").trim()}
            </h2>
          )}
          {fundraisingTotal && (
            <p className="mt-2">{JSON.stringify(fundraisingTotal)}</p>
          )}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleReset}
              className="w-1/2 px-4 py-2 font-semibold text-white bg-gradient-to-r from-blue-600 to-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-red-700 active:bg-red-800"
            >
              Reset
            </button>
          </div>
        </>
      )}
    </main>
  );
}
