import React from "react";
import { partyName, stateFullName } from "../utils/helpers";
export default function CandidateSelect({ candidate, onSelect }) {
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => onSelect(candidate.candidate_id)}
        className={`p-4 rounded-lg w-3/4 cursor-pointer ${
          candidate.party === "DEM"
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        <h2>{candidate.name.split(",").reverse().join(" ").trim()}</h2>
        <p>({partyName(candidate.party)})</p>
        <p>{stateFullName(candidate.state)}</p>
      </button>
    </div>
  );
}
