import ChatPage from "./pages/ChatPage";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router-dom";

function App() {
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ChatPage/>}/>
        <Route path="/login" element={<LogIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
    </div>
  );
}

export default App;
