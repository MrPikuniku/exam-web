
import React from 'react';
import TaskItem from './TaskItem';

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle }) => {
  return (
    <ul>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} />
      ))}
    </ul>
  );
};

export default TaskList;
