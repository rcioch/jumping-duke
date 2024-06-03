import './App.css';
import Game from '@/game/components/Game';

function App() {
  return (
    <div className='column'>
      <p className='title'>JumpingDuke - 25 Anniversary Edition</p>
      <a className='link' href='https://github.com/rcioch/jumping-duke'>
        https://github.com/rcioch/jumping-duke
      </a>
      <Game />
    </div>
  );
}

export default App;
