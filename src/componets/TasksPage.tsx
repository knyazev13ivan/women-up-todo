import React from "react";
import TaskList from "./TaskList";
import CreateTask from "./CreateTask";

const TasksPage: React.FC = () => {
  return (
    <div className="tasks-page">
        <CreateTask />
        <TaskList />
    </div>
  );
};

export default TasksPage;
