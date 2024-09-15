import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API requests
import './styles/globals.css'; // Ensure this path is correct

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true); // Start loading
    setError(''); // Clear previous errors
  
    try {
      const response = await axios.post('https://vit-tm-task.api.trademarkia.app/api/v3/us', {
        input_query: searchQuery,
        input_query_type: "",
        sort_by: "default",
        status: [],
        exact_match: false,
        date_query: false,
        owners: [],
        attorneys: [],
        law_firms: [],
        mark_description_description: [],
        classes: [],
        page: 1,
        rows: 10,
        sort_order: "desc",
        states: [],
        counties: []
      }, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      });
  
      // Log the response data and hits
      console.log('Full response data:', response.data);
      const hits = response.data.body.hits.hits || [];
      console.log('Hits:', hits);
  
      // Log each _source to understand its structure
      hits.forEach(hit => console.log('Hit _source:', hit._source));
  
      // Map hits to include additional fields
      setResults(hits.map(hit => ({
        name: hit._source.mark_identification || 'No Name',
        registration_number: hit._source.registration_number || 'N/A',
        filing_date: hit._source.filing_date ? new Date(hit._source.filing_date * 1000).toLocaleDateString() : 'N/A',
        registration_date: hit._source.registration_date ? new Date(hit._source.registration_date * 1000).toLocaleDateString() : 'N/A',
        renewal_date: hit._source.renewal_date ? new Date(hit._source.renewal_date * 1000).toLocaleDateString() : 'N/A',
        status: hit._source.status_type || 'Unknown',
        owner: hit._source.current_owner || 'N/A',
        attorney: hit._source.attorney_name || 'N/A',
        law_firm: hit._source.law_firm || 'N/A',
        description: hit._source.mark_description_description.join(', ') || 'No Description'
      })));
  
    } catch (error) {
      setError('Error fetching data'); // Update error state
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Trademark Search</h1>
        <input
          type="text"
          placeholder="Search trademarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="App-input"
        />
        <button
          onClick={handleSearch}
          className="App-button"
        >
          Search
        </button>

        {/* Loading state */}
        {loading && <p>Loading...</p>}

        {/* Error state */}
        {error && <p className="App-error">{error}</p>}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <p className="results-summary">{results.length} results found</p>
            <ul>
              {results.map((result, index) => (
                <li key={index} className="result-item">
                  <div><strong>Name:</strong> {result.name}</div>
                  <div><strong>Registration Number:</strong> {result.registration_number}</div>
                  <div><strong>Filing Date:</strong> {result.filing_date}</div>
                  <div><strong>Registration Date:</strong> {result.registration_date}</div>
                  <div><strong>Renewal Date:</strong> {result.renewal_date}</div>
                  <div><strong>Status:</strong> {result.status}</div>
                  <div><strong>Owner:</strong> {result.owner}</div>
                  <div><strong>Attorney:</strong> {result.attorney}</div>
                  <div><strong>Law Firm:</strong> {result.law_firm}</div>
                  <div><strong>Description:</strong> {result.description}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
