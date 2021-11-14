import './App.css';
import FiltersBox from './Components/FiltersBox';
import React, { useState } from 'react';
import Images from './Components/Images';
import SelectedTagContext from './SelectedTagContext';

function App() {
  const [selectedTag, setSelectedTag] = useState('all');

  return (
    <div className="App">
      <SelectedTagContext.Provider value={{selectedTag, setSelectedTag}}>
        <FiltersBox></FiltersBox>
        <Images></Images>
      </SelectedTagContext.Provider>
    </div>
  );
}

export default App;
