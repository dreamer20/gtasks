import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { initApp } from '../actions/';
import CssBaseline from '@material-ui/core/CssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress';
import Login from './Login';
import { withStyles } from '@material-ui/core/styles';
import TasksBar from './TasksBar';
import TasksDrawer from './TasksDrawer';
import TaskLists from './TaskLists';
import Tasks from './Tasks';

class App extends Component {

  componentDidMount() {
    const { initApp } = this.props;
    initApp();
  }

  render() {
    const { isFetching,
            screen,
            classes } = this.props;
    let currentScreen;
    switch (screen) {
      case 'login':
        currentScreen = <Login />;
        break;
      case 'tasklists':
        currentScreen = <TaskLists />;
        break;
      case 'tasks':
        currentScreen = <Tasks />;
        break;
      default:
        currentScreen = null;
    }

    return (
      <Fragment>
        <CssBaseline />
        <div className={classes.root}>
        <TasksBar />
        <TasksDrawer />
        
        <main className={classes.content}>
        <div className={classes.toolbar} />
        { isFetching ?
          <LinearProgress className={classes.progress} color="secondary" /> : 
          null }
        { currentScreen }</main>
        </div>
      </Fragment>
    );
  }
}

const mapStateToPropsApp = (state) => {
  return {
    isFetching: state.isFetching,
    screen: state.screen
  };
}

const mapDispatchToPropsApp = (dispatch) => {
  return {
    initApp: () => dispatch(initApp())
  }
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  progress: {
    marginTop: -5
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    marginTop: 5
  }
});

App.propTypes = {
  initApp: PropTypes.func,
  isFetching: PropTypes.bool,
  screen: PropTypes.string,
  classes: PropTypes.object
};


export default connect(mapStateToPropsApp, mapDispatchToPropsApp)(withStyles(styles, { withTheme: true })(App));
