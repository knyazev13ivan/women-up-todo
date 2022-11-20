import React from "react";
import TaskCard, { ITask } from "./TaskCard";
import { useGetTasksQuery } from "../store/tasks/tasks.api";

const TaskList: React.FC = () => {
  const { data: tasks, error, isLoading } = useGetTasksQuery("");

  return (
    <div>
      {isLoading && "Loading..."}
      {tasks && (
        <ul className="task-list">
          {tasks
            .slice(0)
            .map(({ id, title, description, date, attachment, isCompleted }: ITask) => (
              <TaskCard
                key={id}
                id={id}
                title={title}
                description={description}
                date={date}
                attachment={attachment}
                isCompleted={isCompleted}
              />
            ))}
        </ul>
      )}

      {error && "Ошибка при получении списка задач"}
    </div>
  );
};

export default React.memo(TaskList);
