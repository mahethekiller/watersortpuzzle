import './style.css';
import { Game } from './core/Game';

window.addEventListener('DOMContentLoaded', async () => {
  const appContainer = document.querySelector<HTMLDivElement>('#app');
  if (!appContainer) {
    console.error('Failed to find #app container element.');
    return;
  }

  try {
    await Game.getInstance().init(appContainer);
  } catch (error) {
    console.error('Failed to initialize Game:', error);
  }
});
