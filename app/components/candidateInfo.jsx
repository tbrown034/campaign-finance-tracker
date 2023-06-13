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
      // sort the data in ascending order
      fundraising.sort((a, b) => a.cycle - b.cycle);

      // calculate cumulative funds
      let cumulativeFunds = 0;
      const cumulativeFundraising = fundraising.map((fund) => {
        cumulativeFunds += fund.receipts;
        return cumulativeFunds;
      });

      const chart = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: fundraising.map((fund) => fund.cycle), // Election cycles
          datasets: [
            {
              label: "Total Raised ($)",
              data: cumulativeFundraising, // Cumulative money raised
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              borderWidth: 7, // this line controls the thickness

              tension: 0.2,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Election Cycle",
              },
            },
            y: {
              title: {
                display: true,
                text: "Cumulative Amount",
              },
            },
          },
          animation: {
            duration: 2000, // general animation time
            // More animation options could go here
          },
        },
      });
    }
  }, [fundraising]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 sm:px-0">
      <div className="flex flex-col w-full gap-2">
        <h2 className="mt-4 text-2xl font-semibold text-center sm:text-left">
          {candidate.name.split(",").reverse().join(" ").trim()}
        </h2>
        <div>
          <p className="text-center sm:text-left">
            {finalName}{" "}
            {candidate.candidate_status === "C" ? "is running" : "ran"} as a
            member of the {partyName(candidate.party)} Party for{" "}
            {stateFullName(candidate.address_state)}&apos;s U.S.{" "}
            {candidate.office_full} District {candidate.district}.{" "}
            {lastNameCapitalized} ran in {yearsActive}.{" "}
          </p>
        </div>
      </div>
      <div className="w-full">
        {fundraising &&
          fundraising.map((fund, index) => (
            <div key={index} className="text-center sm:text-left">
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
      <div className="w-full sm:px-20 ">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
