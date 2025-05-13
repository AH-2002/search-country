import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [query, setQuery] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const Base_url = "https://restcountries.com/v3.1/all";

  useEffect(() => {
    async function fetchCountries() {
      try {
        let { data } = await axios.get(Base_url);
        setAllCountries(data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredCountries([]);
    } else {
      const filtered = allCountries.filter((country) =>
        country?.name?.common?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [query, allCountries]);

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    setQuery("");
    setFilteredCountries([]);
  };

  const getCurrencyName = (country) => {
    const currencies = country.currencies;
    if (!currencies) return "Not available";
    const firstKey = Object.keys(currencies)[0];
    return currencies[firstKey]?.name || "Not available";
  };

  return (
    <section className="p-5">
      <div className="container">
        <div className="row position-relative">
          <div className="col-10">
            <input
              className="form-control"
              type="text"
              placeholder="Search for a country"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {query && filteredCountries.length > 0 && (
              <div
                className="position-absolute bg-white border rounded w-100 z-1 mt-1"
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                {filteredCountries.slice(0, 3).map((country, index) => (
                  <div
                    key={index}
                    className="p-2 border-bottom"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCountryClick(country)}
                  >
                    <strong>{country.name.common}</strong>
                    <img
                      src={country.flags.svg}
                      alt={country.name.common}
                      width="30"
                      className="ms-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-2">
            <button className="btn btn-primary w-100" disabled>
              Search
            </button>
          </div>
        </div>

        {/* Show selected country details */}
        {selectedCountry && (
          <div className="mt-5 border p-4 rounded bg-light">
            <h4>Country Details</h4>
            <p><strong>Name:</strong> {selectedCountry.name.common}</p>
            <p>
              <strong>Flag:</strong><br />
              <img
                src={selectedCountry.flags.svg}
                alt="Flag"
                width="100"
                className="mt-2"
              />
            </p>
            <p><strong>Capital:</strong> {selectedCountry.capital?.[0] || "Not available"}</p>
            <p><strong>Population:</strong> {selectedCountry.population.toLocaleString()}</p>
            <p><strong>Timezone:</strong> {selectedCountry.timezones?.[0]}</p>
            <p><strong>Currency:</strong> {getCurrencyName(selectedCountry)}</p>
          </div>
        )}
      </div>
    </section>
  );
}
