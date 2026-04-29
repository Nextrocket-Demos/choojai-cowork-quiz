import './styles/global.css';
import { createGame } from './state';
import { mountRouter } from './router';
import { MuteToggle } from './components/ui/MuteToggle';
import { el } from './components/ui/dom';

const app = document.getElementById('app')!;
app.style.height = '100vh';
app.style.width = '100vw';
app.style.maxWidth = '500px';
app.style.margin = '0 auto';
app.style.position = 'relative';
app.style.overflow = 'hidden';
app.style.background = 'black';

// Persistent camera layer — the video element lives here for the duration of the
// session and never moves between DOM trees. iOS Safari pauses/de-renders <video>
// when removed from a parent, so we keep the parent stable across state changes.
const cameraLayer = el('div', { class: 'absolute inset-0' });
cameraLayer.style.zIndex = '0';
cameraLayer.style.display = 'none';
app.appendChild(cameraLayer);

// Screen layer — UI overlays, cleared between phases.
const screenLayer = el('div', { class: 'absolute inset-0' });
screenLayer.style.zIndex = '10';
app.appendChild(screenLayer);

document.body.appendChild(MuteToggle());

const game = createGame();
mountRouter(screenLayer, cameraLayer, game);
