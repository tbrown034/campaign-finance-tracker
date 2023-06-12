import React from "react";
import { partyName, stateFullName, formatCurrency } from "../utils/helpers";

export default function CandidateInfo({ candidate, fundraising }) {
  return (
    <div>
      <h2 className="mt-4 text-2xl font-semibold">
        {candidate.name.split(",").reverse().join(" ").trim()}
      </h2>
      <p>{partyName(candidate.party)}</p>
      <div className="flex gap-2">
        <p>{stateFullName(candidate.state)}</p>
        <p> {candidate.office_full}</p>
        <p>District {candidate.district_number}</p>
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
