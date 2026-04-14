import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { NOTE_MODAL_MODE } from "../../constants/constants";
import CloseSharp from "@mui/icons-material/CloseSharp";

const NotesModal = ({ open, onClose, mode, note, onSubmit }) => {
  const getInitialState = () => ({
    title: note?.title || "",
    description: note?.content || "",
    tags: note?.tags || [],
  });

  const [formData, setFormData] = useState(getInitialState());
  const [inputTag, setInputTag] = useState("");

  const isAdd = mode === NOTE_MODAL_MODE.ADD;
  //const isEdit = mode === NOTE_MODAL_MODE.EDIT;
  const isView = mode === NOTE_MODAL_MODE.VIEW;
  const isDelete = mode === NOTE_MODAL_MODE.DELETE;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAction = () => {
    if (isDelete) {
      onSubmit(null, mode, note?.id);
    } else {
      onSubmit(formData, mode, note?.id);
    }
    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case NOTE_MODAL_MODE.ADD:
        return "Add Note";
      case NOTE_MODAL_MODE.EDIT:
        return "Edit Note";
      case NOTE_MODAL_MODE.VIEW:
        return "View Note";
      case NOTE_MODAL_MODE.DELETE:
        return "Delete Note";
      default:
        return "";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key == "Enter" && inputTag.trim() !== "") {
      e.preventDefault();
      if (!formData.tags.includes(inputTag.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...formData.tags, inputTag.trim()],
        }));
      }
      setInputTag("");
    }
  };

  const handleClose = (tagToRemove) => {
    const filteredTags = formData.tags.filter((x) => x !== tagToRemove);
    setFormData((prev) => ({
      ...prev,
      tags: filteredTags,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{getTitle()}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {isDelete ? (
            <Typography>
              Are you sure you want to delete <strong>{note?.title}</strong>?
            </Typography>
          ) : (
            <>
              <TextField
                label="Title"
                name="title"
                fullWidth
                value={formData.title}
                onChange={handleChange}
                disabled={isView}
              />
              <TextField
                label="Content"
                name="description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                disabled={isView}
              />
              {!isView && (
                <TextField
                  label="Tag"
                  name="tag"
                  fullWidth
                  value={inputTag}
                  onChange={(e) => setInputTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              )}
              {formData.tags.length !== 0 && (
                <Stack direction="row" gap={2} flexWrap="wrap">
                  {formData.tags.map((tag) => (
                    <Button key={tag} variant="tagsBtn">
                      {tag}{" "}
                      {!isView && (
                        <CloseSharp
                          fontSize="2px"
                          sx={{ ml: 2 }}
                          onClick={() => handleClose(tag)}
                        />
                      )}
                    </Button>
                  ))}
                </Stack>
              )}
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {!isView && (
          <Button
            variant="contained"
            color={isDelete ? "error" : "primary"}
            onClick={handleAction}
          >
            {isDelete ? "Delete" : isAdd ? "Create" : "Save"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NotesModal;
