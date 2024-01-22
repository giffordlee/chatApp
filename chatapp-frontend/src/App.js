import ChatPage from "./pages/ChatPage";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router-dom";
import { ChatState } from "./context/ChatProvider";
import { Navigate } from "react-router-dom";
function App() {
  const {user }= ChatState();

  return (
    <div className="App">
      <Routes>
        <Route path="/chats" element={user ? <ChatPage/> : <Navigate to="/" replace='true'/>}/>
        <Route path="/" element={<LogIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </div>
  );
}

export default App;
