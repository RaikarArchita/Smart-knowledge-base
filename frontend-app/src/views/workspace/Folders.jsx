import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import MoreVertOutlined from "@mui/icons-material/MoreVertOutlined";
import TextField from "@mui/material/TextField";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateFolder,
  useDeleteFolder,
  useGetFoldersTree,
  useRenameFolder,
} from "./folders.services";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import CloseSharp from "@mui/icons-material/CloseSharp";

const NewFolderTextfield = ({ onCreate, onClose, folderName, onChange }) => {
  return (
    <FormControl variant="outlined">
      <OutlinedInput
        id="form-label-input"
        endAdornment={
          <InputAdornment position="end">
            <CloseSharp
              fontSize="small"
              onClick={onClose}
              sx={{ cursor: "pointer" }}
            />
          </InputAdornment>
        }
        name="folderName"
        value={folderName}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onCreate();
            onClose();
          }
          if (e.key === "Escape") {
            onClose();
          }
        }}
      />
    </FormControl>
  );
};

const FolderItem = ({ folder, level = 0, onRename, onDelete, onCreate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [childName, setChildName] = useState("");

  const navigate = useNavigate();
  const { folderId } = useParams();

  const isRoot = folder.parent_id == null;
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRename = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    handleMenuClose();
  };

  const handleRenameSave = () => {
    onRename(folder.id, newName);
    setIsEditing(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pl: isRoot ? 1 : level * 2,
          py: 1,
          mt: isRoot ? 2 : 0,
          bgcolor: folderId == folder.id ? "#e3f2fd" : "transparent",
          fontWeight: isRoot ? "bold" : "normal",
          borderRadius: 1,
          cursor: "pointer",
        }}
        onClick={() => {
          if (!isEditing && !isAddingChild) {
            navigate(`/workspace/${folder.id}`);
          }
        }}
      >
        {isEditing ? (
          <TextField
            size="small"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRenameSave();
              }
              if (e.key === "Escape") {
                setIsEditing(false);
                setNewName(folder.name);
              }
            }}
            autoFocus
          />
        ) : (
          <Typography variant={isRoot ? "h6" : "body2"}>
            {folder.name}
          </Typography>
        )}
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreVertOutlined fontSize="small" />
        </IconButton>

        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem
            onClick={handleRename}
            sx={{
              fontSize: "0.9rem",
            }}
          >
            Rename
          </MenuItem>
          <MenuItem
            sx={{
              fontSize: "0.9rem",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(folder.id);
              handleMenuClose();
            }}
          >
            Delete
          </MenuItem>
          <MenuItem
            sx={{
              fontSize: "0.9rem",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsAddingChild(true);
              handleMenuClose();
            }}
          >
            Add Folder
          </MenuItem>
        </Menu>
      </Box>
      {isAddingChild && (
        <Box sx={{ pl: (level + 1) * 2, py: 1 }}>
          <NewFolderTextfield
            onClose={() => {
              setIsAddingChild(false);
              setChildName("");
            }}
            onChange={setChildName}
            folderName={childName}
            onCreate={() => {
              onCreate(childName, folder.id);
            }}
          />
        </Box>
      )}
      {folder.children &&
        folder.children.map((child) => (
          <FolderItem
            key={child.id}
            folder={child}
            level={level + 1}
            onRename={onRename}
            onDelete={onDelete}
            onCreate={onCreate}
          />
        ))}
    </>
  );
};

const Folders = () => {
  const [folders, setFolders] = useState();
  const [isCreateNewFolder, setCreateNewFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { mutate } = useGetFoldersTree();
  const { mutate: rename } = useRenameFolder();
  const { mutate: mutateDelete } = useDeleteFolder();
  const { mutate: create } = useCreateFolder();

  const getFolders = () => {
    mutate(undefined, {
      onSuccess: (data) => {
        setFolders(data);
      },
    });
  };
  useEffect(() => {
    getFolders();
  }, []);

  const renameFolder = (id, newName) => {
    rename(
      { name: newName, folder_id: id },
      {
        onSuccess: () => {
          getFolders();
        },
      },
    );
  };

  const deleteFolder = (id) => {
    mutateDelete(
      { folder_id: id },
      {
        onSuccess: () => {
          getFolders();
        },
      },
    );
  };

  const createFolder = (folderName, parent_id) => {
    create(
      { name: folderName, parent_id },
      {
        onSuccess: () => {
          getFolders();
          setCreateNewFolder(false);
        },
      },
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxHeight: "86vh",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button sx={{ p: 0 }} onClick={() => setCreateNewFolder(true)}>
          + Create Folder
        </Button>
      </Box>
      {isCreateNewFolder && (
        <NewFolderTextfield
          onCreate={() => createFolder(folderName, null)}
          folderName={folderName}
          onChange={setFolderName}
          onClose={() => setCreateNewFolder(false)}
        />
      )}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {folders &&
          folders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              onRename={renameFolder}
              onDelete={deleteFolder}
              onCreate={createFolder}
            />
          ))}
      </Box>
    </Box>
  );
};

export default Folders;
