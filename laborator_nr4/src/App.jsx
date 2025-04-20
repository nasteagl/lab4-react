import './App.css';
import { ThemeProvider } from './ThemeProvider.jsx';
import { QuizGame } from "./components/QuizGame/QuizGame.jsx";

function App() {
    return (
        <ThemeProvider>
            <div className="App">
                <h1>Jocul de Quiz</h1>
                <QuizGame />
            </div>
        </ThemeProvider>
    );
}

export default App;
