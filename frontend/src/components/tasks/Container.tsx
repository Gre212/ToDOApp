import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'utils/axios';
import { Task } from '../../@types/Task'; // 相対パスじゃないとエラーになる
import TaskCard from './Card';
import TaskModal from './Modal';


function TaskContainer() {
  const [tasks, loadTasks] = useState<Task[]>([]);

  useEffect(()=>{
    getTasks();
  }, []);
  async function getTasks() {
    const response = await axios.get("/tasks");
    console.log(response.data.Items);
    loadTasks(response.data.Items);
  }

  function CardList(){
    const listItems = tasks.map((task) => {
      return (
        <Grid item xs={6} key={task.id}>
          <TaskCard propTask={task} getTask={getTasks}/>
          {/* <TaskModal propTask={task} /> */}
        </Grid>
      )
    });
    return (
      <Grid
        container
        spacing={2}
        columns={{ xs: 8, md: 10 }}
        justifyContent="center"
        >
        {listItems}
        {/* <TaskModal /> */}
      </Grid>
    );
  }

  return (
    <div className='Task-container'>
      <CardList />
    </div>
  );
}



export default TaskContainer;