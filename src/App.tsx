import { HomePage } from 'pages/HomePage';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'common/Theme';
import { CurrentCountryProvider } from 'state';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <CurrentCountryProvider>
          <HomePage />
        </CurrentCountryProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
