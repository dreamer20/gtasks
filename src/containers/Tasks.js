import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { getTasksByTasklistID } from '../reducers/';

const Tasks = (props) => {
  let tasks = [];
  
  for (let task in props.tasks) {
    tasks.push(
      <ListItem button key={task}>
        <ListItemText primary={props.tasks[task].title} />
      </ListItem>
    );
  }

  return (
    <List>
      {tasks}
    </List>
  );    
};

const mapStateToProps = (state) => ({
    tasks: getTasksByTasklistID(state.tasks, state.selectedTasklist)
});

Tasks.propTypes = {
  tasks: PropTypes.object
};

export default connect(mapStateToProps)(Tasks);