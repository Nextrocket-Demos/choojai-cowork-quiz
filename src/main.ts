import './styles/global.css';
import { createGame } from './state';
import { mountRouter } from './router';
import { MuteToggle } from './components/ui/MuteToggle';

const app = document.getElementById('app')!;
app.style.height = '100vh';
app.style.width = '100vw';
app.style.maxWidth = '500px';
app.style.margin = '0 auto';
app.style.position = 'relative';

document.body.appendChild(MuteToggle());

const game = createGame();
mountRouter(app, game);
