
import React from 'react';

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  return (
    <li 
      onClick={() => onToggle(task.id)} 
      style={{ 
        textDecoration: task.completed ? 'line-through' : 'none',
        cursor: 'pointer'
      }}
    >
      {task.name}
    </li>
  );
};

export default TaskItem;
