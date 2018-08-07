import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Checkbox from '@material-ui/core/Checkbox';
import ModalDialog from './ModalDialog';
import EditTaskField from './EditTaskField';
import AddTaskBtn from './AddTaskBtn';
import NewTaskField from './NewTaskField';
import { getTasksByTasklistID } from '../reducers/';
import { toggleTask, deleteTask, editTask } from '../actions/';

class Tasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      newTaskFieldIsVisible: false,
      modalDialogSettings: {
        isOpen: false,
        action: '',
        handler: null,
        onClose: null
      }
    };

    this.editedTask = {
      id: null,
      newTitle: null
    };

    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.closeModalDialog = this.closeModalDialog.bind(this);
    this.openDeletionModalDialog = this.openDeletionModalDialog.bind(this);
    this.editTask = this.editTask.bind(this);
    this.handleEditFocus = this.handleEditFocus.bind(this);
    this.openDeletionModalDialog = this.openDeletionModalDialog.bind(this);
    this.openEditModalDialog = this.openEditModalDialog.bind(this);
    this.handleEditTask = this.handleEditTask.bind(this);
    this.accomplishEdit = this.accomplishEdit.bind(this);
    this.cancelEditTask = this.cancelEditTask.bind(this);
    this.showNewTaskField = this.showNewTaskField.bind(this);
    this.hideNewTaskField = this.hideNewTaskField.bind(this);
  }

  handleOpenMenu(event, taskID, tasklistID) {
    this.taskID = taskID;
    this.tasklistID = tasklistID;
    this.setState({ anchorEl: event.currentTarget });
  }

  handleCloseMenu(event) {
    this.setState({ anchorEl: null });
  }

  deleteTask() {
    const { deleteTask } = this.props;
    deleteTask(this.tasklistID, this.taskID);
    this.closeModalDialog();
  }

  editTask() {
    this.setState({
      anchorEl: null
    }, () => this.editedTask.id = this.taskID);
  }

  accomplishEdit() {
    const { editTask } = this.props;
    editTask(this.tasklistID, this.editedTask.id, this.editedTask.newTitle)
      .then(this.cancelEditTask, e => console.log(e));
  }

  handleEditTask(newTitle) {
    this.editedTask.newTitle = newTitle;
    this.openEditModalDialog();
  }

  cancelEditTask() {
    this.editedTask.id = null;
    this.editedTask.newTitle = null;
    this.closeModalDialog();
  }

  openDeletionModalDialog() {
    this.setState({
      anchorEl: null,
      modalDialogSettings: {
        action: 'delete',
        handler: this.deleteTask,
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
        handler: this.accomplishEdit,
        isOpen: true,
        onClose: this.cancelEditTask
      }
    });
  }

  handleEditFocus() {
    // It's needed to focus field
    if (this.editedTask.id) {
      this.forceUpdate();
    }
  }

  closeModalDialog() {
    this.setState({
      modalDialogSettings: {
        ...this.state.modalDialogSettings,
        isOpen: false
      }
    })
  }

  showNewTaskField() {
    this.setState({ newTaskFieldIsVisible: true });
  }

  hideNewTaskField() {
    this.setState({ newTaskFieldIsVisible: false });
  }
  render() {
    const { tasks, tasklistID, toggleTask } = this.props;
    const { anchorEl, modalDialogSettings, newTaskFieldIsVisible } = this.state;
    let taskList = [];

    for (let taskID in tasks) {
      if (this.editedTask.id === taskID) {
        taskList.push(
          <ListItem key={taskID}>
            <EditTaskField
              currentTitle={tasks[taskID].title}
              handleEditTask={this.handleEditTask}
              cancelEdit={this.cancelEditTask} />
          </ListItem>
        );
      } else {
        taskList.push(
          <ListItem
            button
            key={taskID}
            onClick={() => {toggleTask(tasklistID, tasks[taskID])}}>
            <Checkbox
              checked={tasks[taskID].status === 'completed' ? true : false }
              tabIndex={-1}
              disableRipple />
            <ListItemText primary={tasks[taskID].title} />
            <ListItemSecondaryAction>
              <IconButton
                olor="default"
                aria-label="Меню списка"
                onClick={(e) => this.handleOpenMenu(e, taskID, tasklistID)}>
                <Icon>
                  more_horiz
                </Icon>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      }
    }

    return (
      <div>
      <List>
        {taskList}
        {newTaskFieldIsVisible ?
          <NewTaskField
            tasklistID={tasklistID}
            hideField={this.hideNewTaskField} /> :
          null
        }
      </List>
      <Menu
          id='TaskMenu'
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
          <MenuItem onClick={this.editTask}>
            <ListItemIcon>
              <Icon>edit</Icon>
            </ListItemIcon>
            Редактировать
          </MenuItem>
      </Menu>
      <AddTaskBtn
        showField={this.showNewTaskField} />
      <ModalDialog
        settings={modalDialogSettings}
        />
      </div>
    ); 
  }
}


const mapStateToProps = (state) => ({
    tasks: getTasksByTasklistID(state.tasks, state.selectedTasklist),
    tasklistID: state.selectedTasklist
});

const mapDispatchToProps = (dispatch) => ({
  toggleTask(tasklistID, task) {
    dispatch(toggleTask(tasklistID, task));
  },

  deleteTask(tasklistID, taskID) {
    dispatch(deleteTask(tasklistID, taskID));
  },

  editTask(tasklistID, taskID, newTitle) {
    return dispatch(editTask(tasklistID, taskID, newTitle));
  }
});

Tasks.propTypes = {
  tasks: PropTypes.object,
  tasklistID: PropTypes.string,
  deleteTask: PropTypes.func,
  toggleTask: PropTypes.func,
  editTask: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);