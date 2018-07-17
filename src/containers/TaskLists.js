import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { selectTasklist, deleteTasklist } from '../actions/';

class TaskLists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null
    };

    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
    this.deleteTasklist = this.deleteTasklist.bind(this);
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

  render() {
    const { tasklists, selectTasklist, children } = this.props;
    const { anchorEl } = this.state;

    let list = [];

    for (let tasklistID in tasklists) {
      list.push(
        <ListItem onClick={() => selectTasklist(tasklistID)} button key={tasklistID}>
          <ListItemText primary={tasklists[tasklistID].title} />
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
            onClose={this.handleCloseMenu}>
            <MenuItem onClick={this.deleteTasklist}>
              <ListItemIcon>
                <Icon>delete</Icon>
              </ListItemIcon>
              Удалить
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
  selectTasklist: PropTypes.func,
  deleteTasklist: PropTypes.func
};


export default connect(mapStateToProps, mapDispatchToProps)(TaskLists);