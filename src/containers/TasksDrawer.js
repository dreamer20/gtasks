import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { toggleDrawer } from '../actions/';
import TaskLists from './TaskLists';
import AddTasklistBtn from './AddTasklistBtn';
import NewTasklistField from './NewTasklistField';

class TasksDrawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textFieldIsVisible: false,
      drawerScrollTop: 0
    };

    this.showField = this.showField.bind(this);
    this.hideField = this.hideField.bind(this);
  }

  showField() {
    this.setState({ textFieldIsVisible: true });
  }
  hideField() {
    this.setState({ textFieldIsVisible: false });
  }

  render() {
    const { classes, isDrawerOpen, toggleDrawer, isAuthorized } = this.props;
    const { textFieldIsVisible } = this.state;
    console.log(textFieldIsVisible);
    const drawerContent = (
      <Fragment>
        <div >
        <div className={classes.drawerHeader}>
          <Typography variant='title' color='primary' className={classes.flex}>
            Списки задач
          </Typography>
        </div>
         <Divider />
        <TaskLists>
          { textFieldIsVisible ?
            <NewTasklistField 
              hideField={this.hideField} 
              isVisible={textFieldIsVisible} /> :
            null }
        </TaskLists>
        { isAuthorized ? 
          <AddTasklistBtn
            drawerScrollTop={this.state.drawerScrollTop}
            showField={this.showField} /> :
          null }
        </div>
      </Fragment>
    );

    return (
      <Fragment>
        <Hidden smDown>
          <Drawer
            anchor='left'
            open
            variant='permanent'
            classes={{
              paper: classes.drawer
            }}>
            { drawerContent }
          </Drawer>
        </Hidden>
        <Hidden mdUp>
          <Drawer
            anchor='left'
            open={isDrawerOpen}
            onClose={toggleDrawer}
            variant="temporary"
            classes={{
              paper: classes.drawer
            }}
            ModalProps={{
              keepMounted: true
            }}>
            { drawerContent }
          </Drawer>
        </Hidden>
      </Fragment>
    );
  }
};

const styles = (theme) => ({
  drawer: {
    width: 240,
    // height: `100%`,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },  
  },
  drawerHeader: {
    display: 'flex',
    padding: '8px',
    alignItems: 'center',
    ...theme.mixins.toolbar
  },
  flex: {
    flex: 1,
  },
});

const mapStateToProps = (state) => ({
  isDrawerOpen: state.isDrawerOpen,
  isAuthorized: state.isAuthorized
});

const mapDispatchToProps = (dispatch) => ({
  toggleDrawer() {
    dispatch(toggleDrawer());
  }
});

TasksDrawer.propTypes = {
  isDrawerOpen: PropTypes.bool,
  isAuthorized: PropTypes.bool,
  toggleDrawer: PropTypes.func,
  classes: PropTypes.object
};

const TasksDrawerWithStyles = withStyles(styles, { withTheme: true })(TasksDrawer);

export default connect(mapStateToProps, mapDispatchToProps)(TasksDrawerWithStyles);
