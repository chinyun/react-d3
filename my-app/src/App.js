import './App.css';
import React, { useEffect, useState } from "react";
import BarChart from './BarChart';
import HorizontalBarChart from './HorizontalBarChart';


function App() {
  return (
    <div className="App">
      <HorizontalBarChart/>
      <BarChart/>
    </div>
  );
}

export default App;
