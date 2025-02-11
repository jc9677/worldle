import React, { useState, useEffect } from 'react';

const PlayerResults = ({ refreshTrigger }) => {
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

    const isToday = (date) => {
      const today = new Date();
      return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
    };

    const extractResultInfo = (resultString) => {
      if (!resultString) return { guesses: null, boxes: null };
      
      // Extract number of guesses
      const guessMatch = resultString.match(/(\d+)\/\d+/);
      const guesses = guessMatch ? guessMatch[1] : null;
      
      // Extract colored boxes
      const lines = resultString.split('\n');
      const boxes = lines
        .filter(line => line.match(/^[⬛🟨🟩]+$/))
        .join('\n');
      
      return { guesses, boxes };
    };

    const fetchResults = () => {
      //const SHEET_ID = '';
      const SHEET_ID = localStorage.getItem('worldle_sheet_id');
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

        // Get all unique players
        const uniquePlayers = [...new Set(rows.map(row => row.Name))];
        
        // Get today's results
        const todayResults = rows.filter(entry => isToday(new Date(entry.Timestamp)));
        
        // Create map of most recent results for today
        const todayPlayerMap = new Map();
        todayResults.forEach(entry => {
          const currentEntry = todayPlayerMap.get(entry.Name);
          if (!currentEntry || new Date(entry.Timestamp) > new Date(currentEntry.Timestamp)) {
            todayPlayerMap.set(entry.Name, entry);
          }
        });

        // Create final results array with all players
        const finalResults = uniquePlayers.map(player => {
          const todayEntry = todayPlayerMap.get(player);
          const resultInfo = todayEntry ? extractResultInfo(todayEntry.Result) : { guesses: null, boxes: null };
          return {
            name: player,
            hasPlayedToday: !!todayEntry,
            guesses: resultInfo.guesses,
            boxes: resultInfo.boxes,
            timestamp: todayEntry ? todayEntry.Timestamp : null
          };
        });

        // Sort by number of guesses (ascending), with non-players at bottom
        finalResults.sort((a, b) => {
          // If neither has played, sort alphabetically
          if (!a.hasPlayedToday && !b.hasPlayedToday) {
            return a.name.localeCompare(b.name);
          }
          // If only one has played, put the one who hasn't played at the bottom
          if (!a.hasPlayedToday) return 1;
          if (!b.hasPlayedToday) return -1;
          // If both have played, sort by number of guesses
          return parseInt(a.guesses) - parseInt(b.guesses);
        });

        setResults(finalResults);
        setLoading(false);
      });
    };

    loadGoogleSheets();
  }, [refreshTrigger]); // Re-run effect when refreshTrigger changes

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
      <h2 className="text-xl font-semibold mb-4 text-gray-200">Player Status</h2>
      <div className="space-y-2">
        {results.map((result) => (
          <div 
            key={result.name}
            className="p-2 rounded bg-gray-700"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-200">{result.name}</span>
              <span className="text-sm text-gray-300">
                {result.hasPlayedToday 
                  ? `${result.guesses} guesses`
                  : "hasn't played yet today"}
              </span>
            </div>
            {result.boxes && (
              <div className="mt-1 font-mono text-sm whitespace-pre leading-tight">
                {result.boxes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerResults;