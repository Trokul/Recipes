import React from 'react';
import { TreeView, TreeItem } from '@material-ui/lab';
import {
    ArrowDropDown,
    ArrowLeft,
    Description,
    Folder
} from '@material-ui/icons';
import {
    Typography,
    Dialog,
    DialogContentText,
    DialogActions,
    DialogTitle,
    DialogContent,
    Button,
    TextField
} from '@material-ui/core';

import { RecipesContext } from './RecipesContext';
import { tree, getLastNodeId } from '../stubs';

import './RecipesTree.css';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

const IconTreeItem = props => {
    const { text, icon: LabelIcon, ...other } = props;

    return (
        <TreeItem
            className="recipes-tree-item"
            label={
                <div className="item-label">
                    <LabelIcon className="item-icon" />
                    <Typography variant="body2">{text}</Typography>
                </div>
            }
            {...other}
        />
    );
};

class RecipesTree extends React.Component {
    state = {
        newFolderDialog: false,
        deleteFileDialog: false,
        deleteFolderDialog: false,
        editFolderDialog: false,
        folderName: '',
        expandedNodes: []
    };

    findFile = item => {
        if (item.files.some(i => i.nodeId === this.context.currItem.nodeId))
            return item;
        if (!item.folders.length) return;

        return item.folders
            .map(this.findFile)
            .filter(i => i)
            .pop();
    };

    findFolder = item => {
        if (item && item.nodeId === this.context.currItem.nodeId) return 1;
        if (!item.folders.length) return;

        if (
            item.folders
                .map(this.findFolder)
                .filter(i => i)
                .pop() === 1
        ) {
            return item;
        }

        return;
    };

    closeDialog = () => {
        this.setState({
            newFolderDialog: false,
            deleteFileDialog: false,
            deleteFolderDialog: false,
            editFolderDialog: false
        });
    };

    onFileEdit = (e, file) => {
        window.open(`${file.url}edit`, '_blank');
    };

    onFileDelete = (e, file) => {
        this.context.changeItem(file);

        this.setState({ deleteFileDialog: true });
    };

    onFileDeleted = () => {
        const { currItem, changeItem } = this.context;

        // Pretty much a heavy recursive logic to find the parent folder
        // can be resolved by saving the parent node for each item, but it makes it even more complicated
        // Filter the returned undefined and pop the only folder
        const folder = tree
            .map(this.findFile)
            .filter(i => i)
            .pop();

        folder.files = folder.files.filter(i => i.nodeId !== currItem.nodeId);
        this.closeDialog();
        changeItem(folder);
    };

    onFolderUpdate = (e, folder) => {
        this.context.changeItem(folder);

        this.setState({ editFolderDialog: true, folderName: folder.title });
    };

    onFolderUpdated = () => {
        const { currItem, changeItem } = this.context;

        if (!this.state.folderName) return alert('אנא בחר שם');

        const folder = tree
            .map(this.findFolder)
            .filter(i => i)
            .pop();

        folder.folders = folder.folders.map(i => {
            if (i.nodeId !== currItem.nodeId) return i;

            return {
                ...i,
                title: this.state.folderName
            };
        });

        this.setState({ folderName: '' });

        changeItem(currItem);

        this.closeDialog();
    };

    onFolderDelete = (e, folder) => {
        this.context.changeItem(folder);

        this.setState({ deleteFolderDialog: true });
    };

    onFolderDeleted = () => {
        const { currItem, changeItem } = this.context;

        // Pretty much a heavy recursive logic to find the parent folder
        // can be resolved by saving the parent node for each item, but it makes it even more complicated
        // Filter the returned undefined and pop the only folder
        const folder = tree
            .map(this.findFolder)
            .filter(i => i)
            .pop();

        folder.folders = folder.folders.filter(
            i => i.nodeId !== currItem.nodeId
        );
        this.closeDialog();
        changeItem(folder);
    };

    onFolderCreate = (e, folder) => {
        this.context.changeItem(folder);

        this.setState({ newFolderDialog: true });
    };

    onFolderCreated = () => {
        if (!this.state.folderName) return alert('אנא בחר שם');

        this.context.currItem.folders.push({
            title: this.state.folderName,
            files: [],
            folders: [],
            nodeId: getLastNodeId()
        });

        if (
            !this.state.expandedNodes.includes(
                `${this.context.currItem.nodeId}`
            )
        ) {
            this.setState({
                expandedNodes: [
                    ...this.state.expandedNodes,
                    `${this.context.currItem.nodeId}`
                ]
            });
        }

        this.setState({ folderName: '' });

        this.context.changeItem(null);
        this.closeDialog();
    };

    onFileCreate = (e, folder) => {
        folder.files.push({
            name: 'קובץ גלוי',
            url:
                'https://colman365-my.sharepoint.com/:w:/r/personal/313363103_stud_colman_ac_il/_layouts/15/Doc.aspx?sourcedoc=%7Be4214547-0725-4b39-8e11-bf8f2e64372b%7D&cid=387c178e-9330-4efa-8f72-24a7a1f7bb9e&action=',
            nodeId: getLastNodeId()
        });

        this.context.changeItem(null);
        this.closeDialog();
    };

    renderFile = file => {
        return (
            <ContextMenuTrigger
                key={file.nodeId}
                id="file-menu"
                collect={() => file}
            >
                <IconTreeItem
                    nodeId={`${file.nodeId}`}
                    text={file.name}
                    icon={Description}
                    onClick={() => this.context.changeItem(file)}
                />
            </ContextMenuTrigger>
        );
    };

    renderFolder = folder => {
        // We need to draw a node without any children so the expand icon will not show
        // and somehow null counts as a children
        if (!folder.folders.length && !folder.files.length)
            return (
                <ContextMenuTrigger
                    key={folder.nodeId}
                    id={folder.nodeId <= 7 ? 'main-folder-menu' : 'folder-menu'}
                    collect={() => folder}
                >
                    <IconTreeItem
                        nodeId={`${folder.nodeId}`}
                        text={folder.title}
                        icon={Folder}
                        onClick={() => this.context.changeItem(folder)}
                    />
                </ContextMenuTrigger>
            );

        return (
            <ContextMenuTrigger
                key={folder.nodeId}
                id={folder.nodeId <= 7 ? 'main-folder-menu' : 'folder-menu'}
                collect={() => folder}
            >
                <IconTreeItem
                    nodeId={`${folder.nodeId}`}
                    text={folder.title}
                    icon={Folder}
                    onClick={() => this.context.changeItem(folder)}
                >
                    {folder.folders.map(this.renderFolder)}
                    {folder.files.map(this.renderFile)}
                </IconTreeItem>
            </ContextMenuTrigger>
        );
    };

    renderDialog() {
        return (
            <>
                <Dialog open={this.state.deleteFolderDialog}>
                    <DialogTitle>מחיקה</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            האם הינך בטוח במחיקה?
                        </DialogContentText>
                        <DialogActions>
                            <Button onClick={this.closeDialog} color="primary">
                                ביטול
                            </Button>
                            <Button
                                onClick={this.onFolderDeleted}
                                color="secondary"
                            >
                                מחק
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
                <Dialog open={this.state.deleteFileDialog}>
                    <DialogTitle>מחיקה</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            האם הינך בטוח במחיקה?
                        </DialogContentText>
                        <DialogActions>
                            <Button onClick={this.closeDialog} color="primary">
                                ביטול
                            </Button>
                            <Button
                                onClick={this.onFileDeleted}
                                color="secondary"
                            >
                                מחק
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
                <Dialog open={this.state.newFolderDialog}>
                    <DialogTitle>יצירת תיקייה חדשה</DialogTitle>
                    <DialogContent>
                        <DialogContentText>אנא הזן שם תיקייה</DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="שם תיקייה"
                            type="text"
                            fullWidth
                            value={this.state.folderName}
                            onChange={e =>
                                this.setState({
                                    folderName: e.target.value
                                })
                            }
                        />
                        <DialogActions>
                            <Button
                                onClick={this.closeDialog}
                                color="secondary"
                            >
                                ביטול
                            </Button>
                            <Button
                                onClick={this.onFolderCreated}
                                color="primary"
                            >
                                יצירה
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
                <Dialog open={this.state.editFolderDialog}>
                    <DialogTitle>שינוי שם תיקייה</DialogTitle>
                    <DialogContent>
                        <DialogContentText>אנא הזן שם תיקייה</DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="שם תיקייה"
                            type="text"
                            fullWidth
                            value={this.state.folderName}
                            onChange={e =>
                                this.setState({
                                    folderName: e.target.value
                                })
                            }
                        />
                        <DialogActions>
                            <Button
                                onClick={this.closeDialog}
                                color="secondary"
                            >
                                ביטול
                            </Button>
                            <Button
                                onClick={this.onFolderUpdated}
                                color="primary"
                            >
                                שנה
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    renderContextMenus() {
        return (
            <>
                <ContextMenu id="file-menu">
                    <MenuItem onClick={this.onFileEdit}>ערוך קובץ</MenuItem>
                    <MenuItem onClick={this.onFileDelete}>מחק קובץ</MenuItem>
                </ContextMenu>
                <ContextMenu id="main-folder-menu">
                    <MenuItem onClick={this.onFolderCreate}>
                        צור תיקייה חדשה
                    </MenuItem>
                </ContextMenu>
                <ContextMenu id="folder-menu">
                    <MenuItem onClick={this.onFolderCreate}>
                        צור תיקייה חדשה
                    </MenuItem>
                    <MenuItem onClick={this.onFolderUpdate}>
                        שנה שם תיקייה
                    </MenuItem>
                    <MenuItem onClick={this.onFolderDelete}>
                        מחק תיקייה
                    </MenuItem>
                </ContextMenu>
            </>
        );
    }

    render() {
        return (
            <RecipesContext.Consumer>
                {({ currItem }) => (
                    <>
                        <TreeView
                            className="recipes-tree"
                            defaultCollapseIcon={<ArrowDropDown />}
                            defaultExpandIcon={<ArrowLeft />}
                            defaultEndIcon={<div style={{ width: 24 }} />}
                            selected={currItem ? `${currItem.nodeId}` : ''}
                            expanded={this.state.expandedNodes}
                            onNodeToggle={(e, expandedNodes) =>
                                this.setState({ expandedNodes })
                            }
                        >
                            {tree.map(this.renderFolder)}
                        </TreeView>
                        {this.renderContextMenus()}
                        {this.renderDialog()}
                    </>
                )}
            </RecipesContext.Consumer>
        );
    }
}

RecipesTree.contextType = RecipesContext;

export default RecipesTree;
