import React, { Component } from 'react';
import PropsTypes from 'prop-types';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { renameTasklist } from '../actions/';


class EditTaskField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.currentTitle
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.checkTextField = this.checkTextField.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleKeyDown(e) {
    switch (e.key) {
      case 'Enter':
        this.checkTextField();
        break;
      case 'Escape':
        this.props.cancelEdit();
        break;
    }
  }

  checkTextField() {
    const { handleEditTask, currentTitle, cancelEdit } = this.props;
    const { value } = this.state;

    if (currentTitle === value) {
      cancelEdit();
    } else {
      handleEditTask(value);
    }
  }

  render() {
    const { isFetching } = this.props;
    const { value } = this.state;

    return (
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
          label="Переименование"/> 
    );
  }
}

const mapStateToProps = (state) => ({
  isFetching: state.isFetching
});

const mapDispatchToProps = (dispatch) => ({
  renameTasklist(tasklistID, newTitle) {
    return dispatch(renameTasklist(tasklistID, newTitle));
  }
});

EditTaskField.propTypes = {
  currentTitle: PropsTypes.string,
  cancelEdit: PropsTypes.func,
  handleEditTask: PropsTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTaskField);