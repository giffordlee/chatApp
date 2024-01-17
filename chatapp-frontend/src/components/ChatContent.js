import React from 'react';
import { Paper, Typography, Grid, ListItem, ListItemText, Fab, List, Divider, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

function ChatContent({ selectedChat, messages }) {
  return (
    <Paper sx={{ flex: 1, pl: 2 }}>
      {selectedChat ? (
        <Grid item xs={9}>
          <List sx={{ height: '70vh', overflowY: 'auto' }}>
            {messages.map((message, index) => (
              <ListItem key={index}>
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText align={message.align} primary={message.text}></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText align={message.align} secondary={message.timestamp}></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Grid container style={{ padding: '20px' }}>
            <Grid item xs={11}>
              <TextField id="outlined-basic-email" label="Type A Message" fullWidth />
            </Grid>
            <Grid xs={1} align="right">
              <Fab color="primary" aria-label="add"><SendIcon /></Fab>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h6">Select a chat to view messages</Typography>
      )}
    </Paper>
  );
}

export default ChatContent;
