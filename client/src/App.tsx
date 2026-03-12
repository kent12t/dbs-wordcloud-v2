import { Navigate, Route, Routes } from "react-router-dom";

import { QuizPage } from "./pages/QuizPage";
import { ResultPage } from "./pages/ResultPage";
import { TVDisplay } from "./pages/TVDisplay";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/tv" element={<TVDisplay />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
