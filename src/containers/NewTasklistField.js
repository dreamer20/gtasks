import React, { Component } from 'react';
import { connect } from 'react-redux';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import { addTasklist } from '../actions/';


class NewTasklistField extends Component {
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
    const { hideField, addTasklist } = this.props;
    const { value } = this.state;

    if (/\S/.test(value)) {
      addTasklist(value).then(hideField);
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
          onKeyDown={this.handleKeyDown}
          inputProps={{
            onBlur: this.checkTextField 
          }}
          label="Имя нового списка"/> 
      </ListItem>
    );
  }
}

const mapStateToProps = (state) => ({
  isFetching: state.isFetching
});

const mapDispatchToProps = (dispatch) => ({
  addTasklist(title) {
    return dispatch(addTasklist(title));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(NewTasklistField);