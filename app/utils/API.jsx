export async function getData(state, year) {
  const API_Key = process.env.NEXT_PUBLIC_FEC_API_KEY;

  const url = `https://api.open.fec.gov/v1/candidates/search/?sort_hide_null=true&page=1&state=${state}&election_year=${year}&api_key=${API_Key}&sort=name&per_page=20&sort_null_only=false&sort_nulls_last=false`;

  const res = await fetch(url);

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  console.log("the data", data);

  return data;
}
