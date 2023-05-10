import * as React from 'react';
import { useState } from 'react';
// material
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  List,
  ListItem,
  Divider,
  ListItemText,
  TextField,
  Box,
} from '@mui/material';
// components
import Page from '../components/Page';

export default function Note() {
  const [list, setList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedId, setSelectedId] = useState(0);
  const [keyword, setKeyword] = useState('');

  const save = () => {
    if (title.trim() === '') {
      document.getElementById('note-title').focus();
      return false;
    }
    if (content.trim() === '') {
      document.getElementById('note-content').focus();
      return false;
    }

    const _list = [...list];
    if (selectedId < 1) {
      _list.push({
        title: title.trim(),
        content: content.trim(),
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
        view: false,
      });
    } else {
      for (let i = 0; i < _list.length; i += 1) {
        if (_list[i].created_at === selectedId) {
          _list[i].title = title.trim();
          _list[i].content = content.trim();
          _list[i].updated_at = new Date().getTime();
          _list[i].view = false;
        }
      }
    }

    setList(_list);
    setIsEdit(false);
  };

  const dateFormat = (t) => {
    const date = new Date(t);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const sec = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  };

  const filteredList = list.filter((item) => item.title.indexOf(keyword) >= 0 || item.content.indexOf(keyword) >= 0);

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" my={5}>
          <Typography variant="h4" gutterBottom>
            Note
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setIsEdit(true);
              setSelectedId(0);
              setTitle('');
              setContent('');
            }}
          >
            New Note
          </Button>
        </Stack>

        {isEdit && (
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '30ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="note-title"
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <TextField
              id="note-content"
              label="Content"
              multiline
              maxRows={4}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
            <Button size="large" variant="contained" sx={{ height: '56px' }} onClick={() => save()}>
              Save
            </Button>
          </Box>
        )}
        <TextField
          id="note-search"
          label="Search"
          variant="outlined"
          sx={{ margin: 1 }}
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
        <Card>
          <Stack direction="row" alignItems="center" justifyContent="space-between" my={2}>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {filteredList.map((item) => {
                return (
                  <>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={item.title}
                        secondary={
                          <>
                            {!item.view && item.content.length > 100 ? (
                              <p>{item.content.substr(0, 100)}...</p>
                            ) : (
                              <p>{item.content}</p>
                            )}
                            <p>created: {dateFormat(item.created_at)}</p>
                            <p>updated: {dateFormat(item.updated_at)}</p>
                            {!item.view && (
                              <a
                                href="#"
                                onClick={() => {
                                  const _list = [...list];
                                  for (let i = 0; i < _list.length; i += 1) {
                                    if (_list[i].created_at === item.created_at) _list[i].view = true;
                                  }
                                  setList(_list);
                                }}
                              >
                                more
                              </a>
                            )}

                            {item.view && (
                              <>
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    setIsEdit(true);
                                    setSelectedId(item.created_at);
                                    setTitle(item.title);
                                    setContent(item.content);
                                  }}
                                  sx={{ margin: 1 }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    const _list = list.filter((l) => l.created_at !== item.created_at);
                                    setList(_list);
                                  }}
                                  sx={{ margin: 1 }}
                                >
                                  Del
                                </Button>
                              </>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </>
                );
              })}

              {filteredList.length < 1 && (
                <ListItem alignItems="flex-start">
                  <ListItemText primary="Empty list..." />
                </ListItem>
              )}
            </List>
          </Stack>
        </Card>
      </Container>
    </Page>
  );
}
