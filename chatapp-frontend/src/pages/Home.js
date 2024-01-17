import ChatPage from "../components/ChatPage";
import NavigationBar from "../components/NavigationBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from 'axios';

function Home() {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login")
      }

      const { data } = await axios.post("http://localhost:4000", {}, {withCredentials: true});
      const { status, user } = data;
      setUsername(user);

      if (!status) {
        removeCookie("token");
        navigate("/login");
      }
    }
    verifyCookie();
  }, [cookies, navigate, removeCookie])

  const SignOut = () => {
    removeCookie("token");
    navigate("/login");
  }
  return (
    <div>
      <NavigationBar SignOut={SignOut} username={username}/>
      <ChatPage/>
    </div>
  )
}

export default Home