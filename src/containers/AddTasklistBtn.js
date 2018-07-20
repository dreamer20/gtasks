import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';

const AddTasklistBtn = ({ classes, showField, isFetching }) => (
  <Tooltip
    title='Добавить список'
    placement='left'>
    <Button 
      variant='fab' 
      color='primary'
      disabled={isFetching}
      aria-label='Добавить список' 
      className={classes.addBtn}
      onClick={showField}>
      <Icon>add</Icon>
    </Button>
  </Tooltip>
);

const styles = {
  addBtn: {
    position: 'sticky',
    left: 156,
    bottom: 10
  },
};

const mapStateToProps = (state) => ({
  isFetching: state.isFetching
});

export default connect(mapStateToProps)(withStyles(styles)(AddTasklistBtn));