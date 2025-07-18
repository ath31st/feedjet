import FeedPage from './pages/FeedPage';
import { ThemeProvider } from './providers/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <FeedPage />
    </ThemeProvider>
  );
}
