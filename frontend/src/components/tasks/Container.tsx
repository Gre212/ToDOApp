import { Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useThrottle } from "rooks";
import axios from 'utils/axios';
import { Task } from '../../@types/Task'; // 相対パスじゃないとエラーになる
import TaskCard from './Card';
import TaskCreateButton from './CreateButton';


function TaskContainer() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lastKey, setLastKey] = useState({Id: "", State:"", CreatedAt: ""});
  const [state, setState] = useState("new");
  const [query, setQuery] = useState("");

  // throttle させることで、inputフィールドのタイプの度にリクエストが飛ぶのを防ぐ
  const [throttledGetTasks] = useThrottle(getTasks, 1000);

  useEffect(()=>{
    // TODO: 下記 Warningが出るが、useEffect の dependency に
    // 　　　　throttledGetTasks を追加すると、無限にリクエストが飛んでしまうため調整が必要。
    // WARNING: React Hook useEffect has a missing dependency: 'throttledGetTasks'.
    throttledGetTasks();
  }, [state, query]);
  async function getTasks() {
    const response = await axios.get("/tasks", {
      "params": {
          "State": state
        }
    });
    console.log(response.data.Items);
    setTasks(response.data.Items);
    setLastKey(response.data.LastEvaluatedKey);
  }

  async function getMoreTasks() {
    if(lastKey === undefined) return;
    const response = await axios.get("/tasks", {
      "params": {
          "State": state,
          "lastId": lastKey.Id,
          "lastState": lastKey.State,
          "lastCreatedAt": lastKey.CreatedAt
        }
    });
    setTasks(tasks.concat(response.data.Items));
    setLastKey(response.data.LastEvaluatedKey);
  }

  function handleStateChange(event: SelectChangeEvent) {
    setState(event.target.value as string);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>){
    const target = event.target as HTMLInputElement;
    setQuery(target.value);
  }

  function CardList(){
    const listItems = tasks.map((task) => {
      return (
        <Grid item xs={6} key={task.Id}>
          <TaskCard propTask={task} getTasks={getTasks}/>
        </Grid>
      )
    });
    return (
      <Grid
        container
        spacing={2}
        columns={{ xs: 8, md: 10 }}
        justifyContent="center"
        sx={{ mt:"8px" }}
        >
        {listItems}
        { (lastKey !== undefined && lastKey.Id !== "") &&
          <Grid item xs={6}>
            <Button onClick={getMoreTasks}>もっと読み込む</Button>
          </Grid>
        }
      </Grid>
    );
  }

  return (
    <>
      <Grid
        container
        columns={{ xs: 8, md: 10 }}
        justifyContent="center">
        <Grid item xs={3}>
          <FormControl>
            <InputLabel id="state">タスクの状態</InputLabel>
            <Select
              labelId="state"
              value={state}
              name="State"
              label="タスクの状態"
              onChange={handleStateChange}>
              <MenuItem value={"new"}>未着手</MenuItem>
              <MenuItem value={"progress"}>対応中</MenuItem>
              <MenuItem value={"done"}>完了済み</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="text"
            fullWidth id="search" label="タイトルで検索" variant="outlined"
            name="query"
            value={query}
            onChange={handleInputChange}
            />
        </Grid>
      </Grid>
      <CardList />
      <TaskCreateButton getTasks={getTasks}/>
    </>
  );
}



export default TaskContainer;
