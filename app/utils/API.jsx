// utils/API.jsx

export async function searchCandidates(name) {
  const API_Key = process.env.NEXT_PUBLIC_FEC_API_KEY;
  const url = `https://api.open.fec.gov/v1/candidates/search/?name=${name}&api_key=${API_Key}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch search candidate data");
  }
  const data = await res.json();

  return data.results;
}

export async function getCandidateDetails(candidateId) {
  const API_Key = process.env.NEXT_PUBLIC_FEC_API_KEY;
  const url = `https://api.open.fec.gov/v1/candidate/${candidateId}/?api_key=${API_Key}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch getcandidatdetails data");
  }
  const data = await res.json();

  return data.results[0];
}

export async function getCandidateFundraisingTotal(candidateId) {
  const API_Key = process.env.NEXT_PUBLIC_FEC_API_KEY;
  const url = `https://api.open.fec.gov/v1/candidate/${candidateId}/totals/?sort=-cycle&sort_null_only=true&sort_nulls_last=true&sort_hide_null=true&api_key=${API_Key}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch fundraising total data");
  }
  const data = await res.json();

  return data.results;
}
