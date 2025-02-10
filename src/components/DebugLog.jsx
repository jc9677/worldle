import React, { useState, useEffect } from 'react';

const DebugLog = () => {
  const [logs, setLogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Override console.log
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      originalLog.apply(console, args);
      setLogs(prev => [...prev, { type: 'log', timestamp: new Date(), message: args.map(arg => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg, null, 2);
        }
        return String(arg);
      }).join(' ') }].slice(-50)); // Keep last 50 logs
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      setLogs(prev => [...prev, { type: 'error', timestamp: new Date(), message: args.map(arg => {
        if (arg instanceof Error) {
          return `${arg.name}: ${arg.message}\n${arg.stack}`;
        }
        if (typeof arg === 'object') {
          return JSON.stringify(arg, null, 2);
        }
        return String(arg);
      }).join(' ') }].slice(-50)); // Keep last 50 logs
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-gray-700 z-50"
      >
        Show Debug Log
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 text-white p-4 font-mono text-sm overflow-auto z-50">
      <div className="absolute top-4 right-4 space-x-2">
        <button
          onClick={() => setLogs([])}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Clear
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
        >
          Close
        </button>
      </div>
      
      <div className="mt-12">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`mb-2 ${log.type === 'error' ? 'text-red-400' : 'text-green-400'}`}
          >
            <span className="text-gray-500">
              {log.timestamp.toLocaleTimeString()}.{log.timestamp.getMilliseconds()}
            </span>
            {' '}
            <span className="text-white whitespace-pre-wrap">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugLog;