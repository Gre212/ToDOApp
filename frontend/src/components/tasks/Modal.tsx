import { FormControl, Select, InputLabel, TextField, SelectChangeEvent, Button, MenuItem, Grid } from '@mui/material';
import React, { useState } from 'react';
import axios from 'utils/axios';
import { Task } from '../../@types/Task'; // 相対パスじゃないとエラーになる

type Props = {
  propTask?: Task,
  handleClose: Function,
  getTasks: Function
};

function TaskModal({propTask = {
      Id: null,
      Title: "",
      Content: "",
      Limit: "",
      State: "",
      CreatedAt: ""
    },
    handleClose,
    getTasks}: Props) {
  const creation = propTask.Id === null;
  const [task, setTask] = useState<Task>(propTask);

  function handleInputChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>){
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    setTask({...task, [target.name]: target.value});
  }

  function handleSelectChange(event: SelectChangeEvent<string>){
    const target = event.target;
    setTask({...task, [target.name]: target.value});
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();

    if (creation) {
      axios.post('/tasks', task);
    } else {
      axios.patch(`/tasks/${task.Id}`, task);
    }
    handleClose();
    getTasks();
  }

  function handleDelete(event: React.FormEvent<HTMLButtonElement>){
    event.preventDefault();
    axios.delete(`/tasks/${task.Id}`);
    handleClose();
    getTasks();
  }

  return (
    <form className='Task-modal' onSubmit={handleFormSubmit}>
      <Grid container spacing={2} sx={{ background:"white", p:"10px", borderRadius:"5px" }}>
        <input type="hidden" name='id' value={task.Id ?? ""}/>
        <Grid item xs={12}>
          <TextField
            name="Title"
            type="text"
            value={task.Title}
            onChange={handleInputChange}
            label="タイトル"
            fullWidth
            sx={{ marginBottom: "10px"}}/>
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="Content"
            value={task.Content}
            onChange={handleInputChange}
            multiline
            fullWidth
            rows={4} />
        </Grid>

        <Grid item xs={4}>
          <TextField
            name="Limit"
            type="date"
            value={task.Limit}
            onChange={handleInputChange}
            />
        </Grid>

        <Grid item xs={4}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="state">着手状態</InputLabel>
            <Select
              id="state"
              labelId="state"
              name="State"
              label="着手状態"
              onChange={handleSelectChange}>
                <MenuItem value="new">着手前</MenuItem>
                <MenuItem value="progress">対応中</MenuItem>
                <MenuItem value="done">完了</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          { task.Id != null &&
            <Button
              value={task.Id}
              onClick={handleDelete}
              sx={{ width:"100%", height:"100%"}}>
              削除
            </Button>
          }
        </Grid>

        <Grid item xs={2}>
          <Button
            variant="outlined"
            type='submit'
            sx={{ width:"100%", height:"100%" }}
            >
              編集完了
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default TaskModal;
