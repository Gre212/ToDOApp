import { useEffect, useState } from 'react';
import { Card, CardContent, CardActions, Button, Typography, Modal } from '@mui/material';
import { Task } from '../../@types/Task'; // 相対パスじゃないとエラーになる
import TaskModal from './Modal';

type Props = {
  propTask: Task,
  getTasks: Function
};

function TaskCard(props: Props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card className='Task-card'>
        <CardContent>
          <Typography component="div" sx={{ mb: 1.5 }}>
            {props.propTask.Title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.propTask.Content}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleOpen}>詳細</Button>
        </CardActions>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
        {/* TODO: 関数を渡すことにWarningが出ているので推奨の書き方に直した方が良さそう */}
        {/* [ref のフォワーディング – React](https://ja.reactjs.org/docs/forwarding-refs.html) */}
        <TaskModal propTask={props.propTask} handleClose={handleClose} getTasks={props.getTasks}/>
      </Modal>
    </>
  );
}

export default TaskCard;
