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
import {
  Typography,
  Stack,
  CardContent,
  Card,
  Button,
  Box,
  FormControl,
  ListItemText,
  MenuItem,
  Pagination,
  Select,
  TextField,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { ArrowDownwardSharp, ArrowUpwardSharp } from "@mui/icons-material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  slotProps: {
    paper: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 180,
      },
    },
  },
};

const Notes = () => {
  const { folderId } = useParams();
  const limit = 9;

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(NOTE_MODAL_MODE.ADD);
  const [selectedNote, setSelectedNote] = useState(null);
  const [page, setPage] = useState(1);
  const [searchByTitle, setSearchByTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [appliedTags, setAppliedTags] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const { mutate: createNote } = useCreateNote();
  const { mutate: editNote } = useEditNote();
  const { mutate: deleteNote } = useDeleteNote();

  const { data } = useGetNotes({
    folderId,
    page,
    limit,
    title: debouncedSearch,
    tags: appliedTags,
    sortOrder,
    sortBy,
  });

  const totalPages = Math.ceil((data?.count || 0) / limit) || 0;

  const handleOpen = (mode, note = null) => {
    setMode(mode);
    setSelectedNote(note);
    setOpen(true);
  };

  const handleSubmit = (data, mode, id) => {
    switch (mode) {
      case NOTE_MODAL_MODE.ADD:
        createNote({
          title: data.title,
          folder_id: folderId,
          content: data.description,
          tags: data.tags,
        });
        break;
      case NOTE_MODAL_MODE.EDIT:
        editNote({
          title: data.title,
          note_id: id,
          content: data.description,
          tags: data.tags,
        });
        break;
      case NOTE_MODAL_MODE.DELETE:
        deleteNote(id);
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

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleTagsChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTags(typeof value === "string" ? value.split(",") : value);
  };

  const handleClear = () => {
    setSelectedTags([]);
    setAppliedTags([]);
    setOpenDropdown(false);
  };

  const handleApply = () => {
    setAppliedTags(selectedTags);
    setOpenDropdown(false);
  };

  useEffect(() => {
    const handleReset = () => {
      setSearchByTitle("");
      setSelectedTags([]);
      setAppliedTags([]);
      setPage(1);
      setSortBy("created_at");
      setSortOrder("desc");
    };
    handleReset();
  }, [folderId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchByTitle);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchByTitle]);

  return (
    <Box>
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
            p: 2,
          })}
        >
          Choose a folder to begin adding notes.
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", mb: 4 }}>
            <Stack flex={1} direction="row" alignItems="center" gap={2}>
              <TextField
                size="small"
                value={searchByTitle}
                onChange={(e) => setSearchByTitle(e.target.value)}
                placeholder="Search by title"
              />
              <FormControl sx={{ width: 200 }} size="small">
                <Select
                  labelId="filter-tags-checkbox-label"
                  id="filter-tags-checkbox"
                  open={openDropdown}
                  onOpen={() => setOpenDropdown(true)}
                  onClose={() => setOpenDropdown(false)}
                  multiple
                  value={selectedTags}
                  onChange={handleTagsChange}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length == 0) {
                      return (
                        <Typography
                          fontSize="14px"
                          sx={(theme) => ({
                            color: theme.palette.text.disabled,
                          })}
                        >
                          Select by tags
                        </Typography>
                      );
                    }
                    return selected.join(", ");
                  }}
                  MenuProps={MenuProps}
                >
                  {data?.available_tags.map((name) => {
                    const selected = selectedTags.includes(name);
                    const SelectionIcon = selected
                      ? CheckBoxIcon
                      : CheckBoxOutlineBlankIcon;
                    return (
                      <MenuItem key={name} value={name}>
                        <SelectionIcon
                          fontSize="small"
                          style={{
                            marginRight: 8,
                            padding: 9,
                            boxSizing: "content-box",
                          }}
                        />
                        <ListItemText primary={name} />
                      </MenuItem>
                    );
                  })}
                  <Box
                    onClick={(e) => e.stopPropagation()} // prevent closing
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      px: 2,
                      py: 1,
                      borderTop: "1px solid #eee",
                      backgroundColor: "white",
                      position: "sticky",
                      bottom: 0,
                      zIndex: 1,
                    }}
                  >
                    <Button
                      size="small"
                      onClick={handleClear}
                      aria-label="Clear filter"
                    >
                      Clear
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleApply}
                      aria-label="Apply Filter"
                    >
                      Apply
                    </Button>
                  </Box>
                </Select>
              </FormControl>
              <FormControl sx={{ width: 200 }} size="small">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  MenuProps={MenuProps}
                >
                  <MenuItem value="created_at">Created Date</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                </Select>
              </FormControl>
              <Button
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                aria-label="Sort Order"
                sx={{ ml: -2}}
              >
                {sortOrder === "asc" ? (
                  <ArrowUpwardSharp sx={{ fontSize: "1.4rem" }} />
                ) : (
                  <ArrowDownwardSharp sx={{ fontSize: "1.4rem" }} />
                )}
              </Button>
            </Stack>
            <Button
              sx={{ p: 1 }}
              onClick={() => handleOpen(NOTE_MODAL_MODE.ADD)}
              aria-label="create_note"
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
              mb: 4,
            }}
          >
            {data &&
              data.data.map((note) => (
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
                      Last Updated: {convertDate(note.updated_at)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
          </Box>
          {data?.count == 0 && (
            <Box
              sx={(theme) => ({
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 10,
                color: theme.palette.error.main,
                fontWeight: 700,
                textAlign: "center",
              })}
            >
              No notes found !!
            </Box>
          )}
          {data?.count !== 0 && (
            <Stack alignItems="end" pr={2}>
              <Pagination
                count={totalPages}
                page={page}
                size="small"
                onChange={handleChange}
              />
            </Stack>
          )}
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
    </Box>
  );
};

export default Notes;
