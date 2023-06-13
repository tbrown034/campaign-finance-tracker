// CandidateInfo.jsx

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
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

  // Calculate total lifetime raised
  let totalLifetimeRaised = fundraising.reduce(
    (total, fund) => total + fund.receipts,
    0
  );

  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const chart = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: fundraising.map((fund) => fund.cycle), // Election cycles
          datasets: [
            {
              label: "Total Raised ($)",
              data: fundraising.map((fund) => fund.receipts), // Money raised
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
      });
    }
  }, [fundraising]);

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
      <div>
        {fundraising &&
          fundraising.map((fund, index) => (
            <div key={index}>
              <li>
                Total raised for the {fund.cycle} election cycle :{" "}
                {formatCurrency(fund.receipts)}
              </li>
            </div>
          ))}
        <h2 className="py-4 text-center">
          Total lifetime raised:{" "}
          <span className="font-bold text-teal-500 underline underline-offset-4">
            {formatCurrency(totalLifetimeRaised)}
          </span>
        </h2>
      </div>
      <div>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
