import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { fetchTasklistsByToken } from '../actions/';

const NextPageBtn = ({ classes, nextPageToken, fetchAction }) => {

  if (!nextPageToken) {
    return null;  
  }

  return (
    <ListItem
      className={classes.nextPageBtn}
      button
      onClick={() => fetchAction(nextPageToken)}>
      <ListItemText
        primaryTypographyProps={{
          variant: 'button'
        }}
        primary='Загрузить еще' />
    </ListItem>
  );
}

NextPageBtn.propsTypes = {
  classes: PropTypes.object,
  nextPageToken: PropTypes.string,
  fetchTasklistsByToken: PropTypes.func
}

const styles = theme => ({
  nextPageBtn: {
    borderTop: '1px solid #bbb'
  }
});

export default withStyles(styles)(NextPageBtn);