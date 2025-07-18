import { ThemeToggleButton } from './components/ThemeToggleButton';
import FeedPage from './pages/FeedPage';
import { ThemeProvider } from './providers/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <ThemeToggleButton />
      <FeedPage />
    </ThemeProvider>
  );
}
