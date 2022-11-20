import React from "react";
import Header from "./componets/Header";
import TasksPage from "./componets/TasksPage";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <main className="main">
        <TasksPage />
      </main>
    </>
  );
};

export default App;
