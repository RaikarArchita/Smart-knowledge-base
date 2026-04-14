import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditNote from "@mui/icons-material/EditNote";
import Delete from "@mui/icons-material/DeleteOutlineSharp";
import NotesModal from "../../components/notes_modal/NotesModal";
import { NOTE_MODAL_MODE } from "../../constants/constants";
import {
  useCreateNote,
  useDeleteNote,
  useEditNote,
  useGetNotes,
} from "./notes.services";

const Notes = () => {
  const { folderId } = useParams();
  const [notes, setNotes] = useState();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(NOTE_MODAL_MODE.ADD);
  const [selectedNote, setSelectedNote] = useState(null);
  const { mutate } = useGetNotes();
  const { mutate: createNote } = useCreateNote();
  const { mutate: editNote } = useEditNote();
  const { mutate: deleteNote } = useDeleteNote();

  const getNotes = () => {
    mutate(folderId, {
      onSuccess: (data) => {
        setNotes(data);
      },
    });
  };

  const handleOpen = (mode, note = null) => {
    setMode(mode);
    setSelectedNote(note);
    setOpen(true);
  };

  const handleSubmit = (data, mode, id) => {
    switch (mode) {
      case NOTE_MODAL_MODE.ADD:
        createNote(
          {
            title: data.title,
            folder_id: folderId,
            content: data.description,
            tags: data.tags,
          },
          {
            onSuccess: () => {
              getNotes();
            },
          },
        );
        break;
      case NOTE_MODAL_MODE.EDIT:
        editNote(
          {
            title: data.title,
            note_id: id,
            content: data.description,
            tags: data.tags,
          },
          {
            onSuccess: () => {
              getNotes();
            },
          },
        );
        break;
      case NOTE_MODAL_MODE.DELETE:
        deleteNote(id, {
          onSuccess: () => {
            getNotes();
          },
        });
        break;
      default:
        break;
    }
  };

  const convertDate = (inputDate) => {
    const istDate = new Date(inputDate);
    const formatted = istDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "medium",
    });
    return formatted;
  };

  useEffect(() => {
    if (folderId) {
      getNotes();
    }
  }, [folderId]);

  return (
    <div>
      {folderId == null ? (
        <Box
          sx={(theme) => ({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 10,
            color: theme.palette.primary.dark,
            fontWeight: 500,
            fontStyle: "italic",
          })}
        >
          Choose a folder to begin adding notes.
        </Box>
      ) : notes && !notes.length ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ p: 0, mb: 4 }}
              onClick={() => handleOpen(NOTE_MODAL_MODE.ADD)}
            >
              + Create Note
            </Button>
          </Box>
          <Box
            sx={(theme) => ({
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 10,
              color: theme.palette.primary.dark,
              fontWeight: 500,
              textAlign: "center",
              fontStyle: "italic",
            })}
          >
            This folder is empty. <br />
            Start by creating your first note.
          </Box>
        </>
      ) : (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ p: 0, mb: 4 }}
              onClick={() => handleOpen(NOTE_MODAL_MODE.ADD)}
            >
              + Create Note
            </Button>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 3,
            }}
          >
            {notes &&
              notes.map((note) => (
                <Card
                  key={note.id}
                  onClick={() => handleOpen(NOTE_MODAL_MODE.VIEW, note)}
                  sx={{ cursor: "pointer" }}
                >
                  <CardContent
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h5">{note.title}</Typography>
                      <Stack direction="row" gap={1}>
                        <EditNote
                          fontSize="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpen(NOTE_MODAL_MODE.EDIT, note);
                          }}
                        />
                        <Delete
                          fontSize="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpen(NOTE_MODAL_MODE.DELETE, note);
                          }}
                        />
                      </Stack>
                    </Stack>
                    <Typography
                      variant="note_content"
                      mt={2}
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        wordBreak: "break-word",
                      }}
                    >
                      {note.content}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography
                      sx={{ fontSize: "0.7rem" }}
                      color="text.secondary"
                      textAlign="right"
                      mt={2}
                    >
                      Last Updated At: {convertDate(note.updated_at)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
          </Box>
        </Box>
      )}

      <NotesModal
        key={mode + (selectedNote?.id || "")}
        open={open}
        onClose={() => setOpen(false)}
        mode={mode}
        note={selectedNote}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Notes;
