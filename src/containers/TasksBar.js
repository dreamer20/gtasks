import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import { toggleDrawer } from '../actions/';
import UserMenu from './UserMenu';

const TasksBar = ({ classes, toggleDrawer }) => (
  <AppBar  className={classes.appBar}>
    <Toolbar>
      <IconButton
        color='inherit'
        aria-label='open drawer'
        className={classes.navIconHide}
        onClick={toggleDrawer}>
        <Icon>
          menu
        </Icon>
      </IconButton>
      <Typography variant='title' color='inherit' className={classes.flex}>
        App
      </Typography>
      <UserMenu />
    </Toolbar>
  </AppBar>
);

const drawerWidth = 240;
const styles = (theme) => ({
  flex: {
    flex: 1,
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    marginRight: 10,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    }
  }
});

const mapDispatchToProps = (dispatch) => ({
  toggleDrawer: () => dispatch(toggleDrawer())
});

TasksBar.propTypes = {
  toggleDrawer: PropTypes.func,
  classes: PropTypes.object
};

const TasksBarWithStyles = withStyles(styles, { withTheme: true })(TasksBar);

export default connect(null, mapDispatchToProps)(TasksBarWithStyles);