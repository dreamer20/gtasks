import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import { resetErrorMessage } from '../actions/';

class ErrorSnackbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: false
    };
  }
  componentDidUpdate(prevProps, prevState) {
    const { errorMessage } = this.props;
    const oldErrorMessage = prevProps.errorMessage;

    if (errorMessage && oldErrorMessage !== errorMessage) {
      this.setState({ isActive: true });
    }

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ isActive: false });
  }

  render() {
    const { errorMessage, resetErrorMessage, classes } = this.props;
    const { isActive } = this.state;

    return (
      <Snackbar
        open={isActive}
        message={errorMessage}
        autoHideDuration={4000}
        onClose={this.handleClose}
        onExited={resetErrorMessage}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={this.handleClose}
          >
            <Icon>close</Icon>
          </IconButton>
        ]} />
    );
  }
};

const mapStateToProps = state => ({
  errorMessage: state.errorMessage
});

const mapDispatchToProps = dispatch => ({
  resetErrorMessage() {
    dispatch(resetErrorMessage());
  }
});

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});


ErrorSnackbar.propTypes = {
  errorMessage: PropTypes.string,
  classes: PropTypes.object,
  resetErrorMessage: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ErrorSnackbar));