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
import { getTasksByTasklistID } from '../reducers/';
import { toggleTask, deleteTask } from '../actions/';

class Tasks extends Component {
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

    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.closeModalDialog = this.closeModalDialog.bind(this);
    this.openDeletionModalDialog = this.openDeletionModalDialog.bind(this);

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

  closeModalDialog() {
    this.setState({
      modalDialogSettings: {
        ...this.state.modalDialogSettings,
        isOpen: false
      }
    })
  }

  render() {
    const { tasks, tasklistID, toggleTask } = this.props;
    const { anchorEl, modalDialogSettings } = this.state;
    let taskList = [];
    
    for (let taskID in tasks) {
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

    return (
      <div>
      <List>
        {taskList}
      </List>
      <Menu
          id='TaskMenu'
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleCloseMenu}>
          <MenuItem onClick={this.openDeletionModalDialog}>
            <ListItemIcon>
              <Icon>delete</Icon>
            </ListItemIcon>
            Удалить
          </MenuItem>
      </Menu>
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
  }
});

Tasks.propTypes = {
  tasks: PropTypes.object,
  tasklistID: PropTypes.string,
  deleteTask: PropTypes.func,
  toggleTask: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);