import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import EditTasklistField from './EditTasklistField';
import ModalDialog from './ModalDialog';
import NextPageBtn from './NextPageBtn';
import { selectTasklist,
         deleteTasklist,
         renameTasklist,
         fetchTasklistsByToken } from '../actions/';

class TaskLists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      editedTasklist: null,
      modalDialogSettings: {
        isOpen: false,
        action: '',
        handler: null,
        onClose: null
      }
    };

    this.editedTasklist = {
      id: null,
      newTitle: null
    };

    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
    this.deleteTasklist = this.deleteTasklist.bind(this);
    this.editTasklist = this.editTasklist.bind(this);
    this.cancelEditTasklist = this.cancelEditTasklist.bind(this);
    this.handleEditFocus = this.handleEditFocus.bind(this);
    this.openDeletionModalDialog = this.openDeletionModalDialog.bind(this);
    this.openEditModalDialog = this.openEditModalDialog.bind(this);
    this.closeModalDialog = this.closeModalDialog.bind(this);
    this.handleEditTasklist = this.handleEditTasklist.bind(this);
    this.renameTasklist = this.renameTasklist.bind(this);
  }

  handleOpenMenu(event, tasklistID) {
    this.tasklistID = tasklistID;
    this.setState({ anchorEl: event.currentTarget });
  }

  handleCloseMenu(event) {
    this.setState({ anchorEl: null });
  }

  deleteTasklist() {
    const { deleteTasklist } = this.props;
    deleteTasklist(this.tasklistID);
    this.closeModalDialog();
  }

  handleEditTasklist(newTitle) {
    this.editedTasklist.newTitle = newTitle;
    this.openEditModalDialog();
  }

  renameTasklist() {
    const { renameTasklist } = this.props;
    renameTasklist(this.editedTasklist.id, this.editedTasklist.newTitle)
      .then(this.cancelEditTasklist);
  }

  editTasklist() {
    this.setState({
      anchorEl: null
    }, () => this.editedTasklist.id = this.tasklistID);
  }

  cancelEditTasklist() {
    this.editedTasklist.id = null;
    this.editedTasklist.newTitle = null;
    this.closeModalDialog();
  }

  handleEditFocus() {
    // It's needed to focus field
    if (this.editedTasklist.id) {
      this.forceUpdate();
    }
  }

  openDeletionModalDialog() {
    this.setState({
      anchorEl: null,
      modalDialogSettings: {
        action: 'delete',
        handler: this.deleteTasklist,
        isOpen: true,
        onClose: this.closeModalDialog
      }
    });
  }

  openEditModalDialog() {
    this.setState({
      anchorEl: null,
      modalDialogSettings: {
        action: 'edit',
        handler: this.renameTasklist,
        isOpen: true,
        onClose: this.cancelEditTasklist
      }
    });
  }

  closeModalDialog() {
    this.setState({
      modalDialogSettings: {
        ...this.state.modalDialogSettings,
        isOpen: false
      }
    })
  }

  render() {
    const { tasklists,
            selectTasklist,
            nextPageToken,
            fetchTasklistsByToken,
            classes,
            children } = this.props;
    const { anchorEl, modalDialogSettings } = this.state;
    let list = [];

    for (let tasklistID in tasklists) {
      if (this.editedTasklist.id === tasklistID) {
        list.push(
          <ListItem key={tasklistID}>
            <EditTasklistField
              currentTitle={tasklists[tasklistID].title}
              handleEditTasklist={this.handleEditTasklist}
              cancelEdit={this.cancelEditTasklist} />
          </ListItem>
        );
      } else {      
        list.push(
          <ListItem
            onClick={() => selectTasklist(tasklistID)} 
            className={classes.listItem}
            button 
            key={tasklistID}>
            <ListItemText
              primary={tasklists[tasklistID].title}
              title={tasklists[tasklistID].title} />
            <ListItemSecondaryAction>
              <IconButton
                color="default"
                aria-label="Меню списка"
                onClick={(e) => this.handleOpenMenu(e, tasklistID)}>
               <Icon>more_horiz</Icon>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      }
    }

    return (
      <div>
        <List>
          {children}
          {list}
          <NextPageBtn
            nextPageToken={nextPageToken}
            fetchAction={fetchTasklistsByToken} />
        </List>
        <Menu
            id='TasklistMenu'
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleCloseMenu}
            onExited={this.handleEditFocus}>
            <MenuItem onClick={this.openDeletionModalDialog}>
              <ListItemIcon>
                <Icon>delete</Icon>
              </ListItemIcon>
              Удалить
            </MenuItem>
            <MenuItem onClick={this.editTasklist}>
              <ListItemIcon>
                <Icon>edit</Icon>
              </ListItemIcon>
              Переименовать
            </MenuItem>
        </Menu>
        <ModalDialog
          settings={modalDialogSettings}
          />
      </div>
    );    
  }
};

const mapStateToProps = (state) => ({
  tasklists: state.tasklists,
  nextPageToken: state.nextPageTokens.tasklists
});

const mapDispatchToProps = (dispatch) => ({
  selectTasklist(tasklistID) {
    dispatch(selectTasklist(tasklistID));
  },

  deleteTasklist(tasklistID) {
    return dispatch(deleteTasklist(tasklistID));
  },

  renameTasklist(tasklistID, newTitle) {
    return dispatch(renameTasklist(tasklistID, newTitle));
  },

  fetchTasklistsByToken(pageToken) {
    dispatch(fetchTasklistsByToken(pageToken));
  }
});

TaskLists.propTypes = {
  tasklists: PropTypes.object,
  classes: PropTypes.object,
  nextPageToken: PropTypes.string,
  selectTasklist: PropTypes.func,
  deleteTasklist: PropTypes.func,
  renameTasklist: PropTypes.func,
  fetchTasklistsByToken: PropTypes.func
};

const styles = theme => ({
  listItem: {
    overflowX: 'hidden'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TaskLists));