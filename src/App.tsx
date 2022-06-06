import { HomePage } from 'pages/HomePage';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'common/Theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <HomePage />
      </div>
    </ThemeProvider>
  );
}

export default App;
