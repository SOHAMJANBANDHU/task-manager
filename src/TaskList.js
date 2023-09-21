import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = ({ onDelete, onViewDetails }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/tasks')
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} 
            <button onClick={() => onViewDetails(task.id)}>View Details</button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
