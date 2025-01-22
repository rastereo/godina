import { Routes, Route } from 'react-router-dom';

import Presentation from '../../pages/Presentation/Presentation';
import Game from '../../pages/Game/Game';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Presentation />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
}

export default App;
