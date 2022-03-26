import { Box, Fab, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskModal from './Modal';
import { useState } from 'react';

type Props = {
  getTasks: Function
};

export default function TaskCreateButton(props: Props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box sx={{ '& > :not(style)': { m: 1 }, position:"fixed", right:"50px", bottom:"50px" }}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleOpen}
          >
          <AddIcon />
        </Fab>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
        {/* TODO: 関数を渡すことにWarningが出ているので推奨の書き方に直した方が良さそう */}
        {/* [ref のフォワーディング – React](https://ja.reactjs.org/docs/forwarding-refs.html) */}
        <TaskModal handleClose={handleClose} getTasks={props.getTasks}/>
      </Modal>
    </>
  );
}
