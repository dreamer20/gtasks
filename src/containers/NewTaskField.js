import React, { Component } from 'react';
import { connect } from 'react-redux';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import { addTask } from '../actions/';


class NewTaskField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.checkTextField = this.checkTextField.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.checkTextField();
    }

    if (e.key === 'Escape') {
      this.props.hideField();
    }
  }

  checkTextField() {
    const { hideField, addTask, tasklistID } = this.props;
    const { value } = this.state;

    if (/\S/.test(value)) {
      addTask(tasklistID, value).then(hideField);
    } else {
      hideField();
    }
  }
  
  render() {
    const { isFetching } = this.props;
    const { value } = this.state;

    return (
      <ListItem>
        <TextField
          value={value}
          onChange={this.handleChange}
          disabled={isFetching}
          autoFocus
          fullWidth
          onKeyDown={this.handleKeyDown}
          inputProps={{
            onBlur: this.checkTextField 
          }}
          label="Новая задача"/> 
      </ListItem>
    );
  }
}

const mapStateToProps = (state) => ({
  isFetching: state.isFetching
});

const mapDispatchToProps = (dispatch) => ({
  addTask(tasklistID, title) {
    return dispatch(addTask(tasklistID, title));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(NewTaskField);