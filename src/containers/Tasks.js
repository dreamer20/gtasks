import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { getTasksByTasklistID } from '../reducers/';
import { toggleTask } from '../actions/';

class Tasks extends Component {
  render() {
    const { tasks, tasklistID, toggleTask } = this.props;
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
        </ListItem>
      );
    }

    return (
      <List>
        {taskList}
      </List>
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
  }
});

Tasks.propTypes = {
  tasks: PropTypes.object,
  tasklistID: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);