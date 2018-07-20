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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import EditTasklistField from './EditTasklistField';
import { selectTasklist, deleteTasklist } from '../actions/';

class TaskLists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      editedTasklist: null
    };

    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
    this.deleteTasklist = this.deleteTasklist.bind(this);
    this.editTasklist = this.editTasklist.bind(this);
    this.cancelEditTasklist = this.cancelEditTasklist.bind(this);
    this.handleEditFocus = this.handleEditFocus.bind(this);
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

    deleteTasklist(this.tasklistID).then(() => {
      this.setState({ anchorEl: null });
    });
  }

  editTasklist() {
    this.setState({
      anchorEl: null
    }, () => this.editedTasklistID = this.tasklistID);
  }

  cancelEditTasklist() {
    this.editedTasklistID = null;
    this.forceUpdate();
  }

  handleEditFocus() {
    // It's needed to focus field
    if (this.editedTasklistID) {
      this.forceUpdate();
    }
  }

  render() {
    const { tasklists,
            selectTasklist,
            children,
            classes } = this.props;
    const { anchorEl } = this.state;

    let list = [];

    for (let tasklistID in tasklists) {
      if (this.editedTasklistID === tasklistID) {
        list.push(
          <ListItem key={tasklistID}>
            <EditTasklistField
              tasklistID={tasklistID}
              isFocused={this.state.isFocused}
              currentTitle={tasklists[tasklistID].title}
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
        </List>
        <Menu
            id='TasklistMenu'
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleCloseMenu}
            onExited={this.handleEditFocus}>
            <MenuItem onClick={this.deleteTasklist}>
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
      </div>
    );    
  }
};

const mapStateToProps = (state) => ({
  tasklists: state.tasklists
});

const mapDispatchToProps = (dispatch) => ({
  selectTasklist(tasklistID) {
    dispatch(selectTasklist(tasklistID));
  },

  deleteTasklist(tasklistID) {
    return dispatch(deleteTasklist(tasklistID));
  }
});

TaskLists.propTypes = {
  tasklists: PropTypes.object,
  classes: PropTypes.object,
  selectTasklist: PropTypes.func,
  deleteTasklist: PropTypes.func
};

const styles = {
  listItem: {
    overflowX: 'hidden'
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TaskLists));