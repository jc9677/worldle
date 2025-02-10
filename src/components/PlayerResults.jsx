import React, { useState, useEffect } from 'react';

const PlayerResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGoogleSheets = () => {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.onload = () => {
        window.google.charts.load('current', { packages: ['corechart'] });
        window.google.charts.setOnLoadCallback(fetchResults);
      };
      document.head.appendChild(script);
    };

    //https://docs.google.com/spreadsheets/d/1VRilOqbxSI_uHD_A_4f4wS4hbRFf7KzXBMGufCO2FzA/edit?usp=sharing
    const fetchResults = () => {
      const SHEET_ID = '1VRilOqbxSI_uHD_A_4f4wS4hbRFf7KzXBMGufCO2FzA';
      const query = new window.google.visualization.Query(
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tq=SELECT *`
      );

      query.send((response) => {
        if (response.isError()) {
          setError('Error loading results: ' + response.getMessage());
          setLoading(false);
          return;
        }

        const data = response.getDataTable();
        const rows = [];
        const columns = [];
        console.log(data);
        console.log("Number of columns: ", data.getNumberOfColumns());
        console.log("Number of rows: ", data.getNumberOfRows());

        // Get column names
        for (let i = 0; i < data.getNumberOfColumns(); i++) {
          columns.push(data.getColumnLabel(i));
        }

        // Get data rows
        for (let i = 0; i < data.getNumberOfRows(); i++) {
          const row = {};
          columns.forEach((col, j) => {
            row[col] = data.getValue(i, j);
          });
          rows.push(row);
        }

        // Group by player and get most recent
        const playerMap = new Map();
        rows.forEach(entry => {
          //console.log(entry.Name);
          //console.log(entry.Result);
          const currentEntry = playerMap.get(entry.Player);
          if (!currentEntry || new Date(entry.Timestamp) > new Date(currentEntry.Timestamp)) {
            playerMap.set(entry.Player, entry);
          }
        });

        setResults(Array.from(playerMap.values()));
        setLoading(false);
      });
    };

    loadGoogleSheets();
  }, []);

  if (loading) {
    return (
      <div className="mt-8 text-center text-gray-400">
        Loading results...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 text-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-200">Latest Results</h2>
      <div className="space-y-2">
        {results.map((result, index) => (
          <div 
            key={`${result.Name}-${index}`}
            className="flex justify-between items-center p-2 rounded bg-gray-700"
          >
            <span className="font-medium">{result.Name}</span>
            <span className="text-sm">
              {result.Result} guesses
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerResults;