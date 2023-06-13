// root page
"use client";
import React, { useState, useEffect } from "react";
import {
  searchCandidates,
  getCandidateDetails,
  getCandidateFundraisingTotal,
} from "./utils/API.jsx";
import CandidateInfo from "./components/candidateInfo.jsx";
import CandidateSelect from "./components/candidateSelect.jsx";

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
        console.log("Candidate Details:", candidateDetails);
        const fundraisingDetails = await getCandidateFundraisingTotal(
          candidateId
        );
        console.log("Fundraising Details:", fundraisingDetails);

        setSelectedCandidate(candidateDetails);
        setFundraisingTotal(fundraisingDetails);
      } catch (error) {
        setError("Failed to fetch candidate details or fundraising total data");
        console.error(error);
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
      {selectedCandidate === null && (
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
            className="w-1/2 px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl "
          >
            Search
          </button>
        </form>
      )}
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && (
        <>
          {!selectedCandidate &&
            candidates.map((candidate) => (
              <CandidateSelect
                key={candidate.candidate_id}
                candidate={candidate}
                onSelect={handleSelectCandidate}
              />
            ))}
          {selectedCandidate && (
            <CandidateInfo
              candidate={selectedCandidate}
              fundraising={fundraisingTotal}
            />
          )}
        </>
      )}
      {(candidates.length > 0 || selectedCandidate) && (
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="w-1/2 px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl "
          >
            Reset
          </button>
        </div>
      )}
    </main>
  );
}
