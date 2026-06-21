import React, { useEffect } from "react";
import TodoBoard from "./pages/TodoBoard";
import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";

const App = () => {
  const [todos, setTodos] = React.useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        // const response = await getTodos();
        // setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      <Navbar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <TodoBoard className="bg-green-500" todos={todos} setTodos={setTodos} />
      </div>
    </div>
  );
};

export default App;
