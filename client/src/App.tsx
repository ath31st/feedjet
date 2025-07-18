import { ThemeSwitcher } from './components/ThemeSwitcher';
import FeedPage from './pages/FeedPage';
import { ThemeProvider } from './providers/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <ThemeSwitcher />
      <FeedPage />
    </ThemeProvider>
  );
}
