import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { selectTasklist } from '../actions/';

class TaskLists extends Component {
  render() {
    const { tasklists, selectTasklist } = this.props;
    let list = [];

    for (let tasklistID in tasklists) {
      list.push(
        <ListItem onClick={() => selectTasklist(tasklistID)} button key={tasklistID}>
          <ListItemText primary={tasklists[tasklistID].title} />
        </ListItem>
      );
    }

    return (
      <List>
        {list}
      </List>
    );    
  }
};

const mapStateToProps = (state) => ({
  tasklists: state.tasklists
});

const mapDispatchToProps = (dispatch) => ({
  selectTasklist(tasklistID) {
    dispatch(selectTasklist(tasklistID));
  }
});

TaskLists.propTypes = {
  tasklists: PropTypes.object,
  selectTasklist: PropTypes.func
};


export default connect(mapStateToProps, mapDispatchToProps)(TaskLists);