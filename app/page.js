"use client";
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
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && (
        <>
          {candidates.map((candidate) => (
            <div
              key={candidate.candidate_id}
              className="flex flex-col items-center"
            >
              <button
                onClick={() => handleSelectCandidate(candidate.candidate_id)}
                className={`p-4 rounded-lg w-3/4 cursor-pointer ${
                  candidate.party === "DEM"
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                <h2>{candidate.name.split(",").reverse().join(" ").trim()}</h2>
                <p>({candidate.party})</p>
                <p>{candidate.candidate_id}</p>
              </button>
            </div>
          ))}

          {selectedCandidate && (
            <div>
              <h2 className="mt-4 text-2xl font-semibold">
                {selectedCandidate.name.split(",").reverse().join(" ").trim()}
              </h2>
              <div className="flex gap-2">
                <p>{selectedCandidate.state}</p>
                <p> {selectedCandidate.office_full}</p>
                <p>District {selectedCandidate.district_number}</p>
              </div>
            </div>
          )}
          {fundraisingTotal && (
            <div className="flex flex-col gap-2">
              <p>
                Total Raised: {JSON.stringify(fundraisingTotal.contributions)}
              </p>
              <p>Total Spent: {JSON.stringify(fundraisingTotal.receipts)}</p>
              <p>
                Year of Last Report:{" "}
                {JSON.stringify(fundraisingTotal.last_report_year)}
              </p>
            </div>
          )}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleReset}
              className="w-1/2 px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
            >
              Reset
            </button>
          </div>
        </>
      )}
    </main>
  );
}
