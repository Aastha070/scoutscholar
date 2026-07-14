import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import EvaluationForm from "./EvaluationForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/evaluation" element={<EvaluationForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
