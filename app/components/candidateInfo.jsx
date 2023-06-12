// CandidateInfo.jsx

import React from "react";
import { partyName, stateFullName, formatCurrency } from "../utils/helpers";

export default function CandidateInfo({ candidate, fundraising }) {
  let nameParts = candidate.name.split(",");
  let lastName = nameParts[0].trim().toLowerCase();
  let lastNameCapitalized =
    lastName.charAt(0).toUpperCase() + lastName.substring(1);

  let name = nameParts.reverse().join(" ").trim().toLowerCase();
  let finalName = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(" ");

  let electionYears = candidate.election_years;
  let lastYear = electionYears.pop();
  let lastYearCheck =
    lastYear === 2024 ? "will be up for election this cycle" : lastYear;
  let yearsActive =
    (electionYears.length ? electionYears.join(", ") + " and " : "") +
    lastYearCheck;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="mt-4 text-2xl font-semibold">
          {candidate.name.split(",").reverse().join(" ").trim()}
        </h2>
        <div>
          <p>
            {finalName}{" "}
            {candidate.candidate_status === "C" ? "is running" : "ran"} as a
            member of the {partyName(candidate.party)} Party for{" "}
            {stateFullName(candidate.address_state)}'s U.S.{" "}
            {candidate.office_full} District {candidate.district}.{" "}
            {lastNameCapitalized} ran in {yearsActive}.{" "}
          </p>
        </div>
      </div>
      {fundraising && (
        <div className="flex flex-col gap-2">
          <p>Total Raised: {formatCurrency(fundraising.contributions)}</p>
          <p>Total Spent: {formatCurrency(fundraising.receipts)}</p>
          <p>
            Cash on Hand:{" "}
            {formatCurrency(fundraising.last_cash_on_hand_end_period)}
          </p>
          <p>
            Year of Last Report: {JSON.stringify(fundraising.last_report_year)}
          </p>
        </div>
      )}
    </div>
  );
}
