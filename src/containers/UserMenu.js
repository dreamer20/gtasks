import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { oauth2URL } from '../oauth2/oauth2';
import { revokeUserAuthorization } from '../actions/';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';

class UserMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null
    };

    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
  }

  handleOpenMenu(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleCloseMenu(event) {
    this.setState({ anchorEl: null });
  }

  render() {
    const { avatarURL, revokeUserAuthorization } = this.props;
    const { anchorEl } = this.state;
    let elemToRender;
    if (avatarURL) {
      elemToRender = (
        <Avatar
          alt="User avatar"
          src={avatarURL}
          onClick={this.handleOpenMenu} />
        );
    } else {
      elemToRender = (
        <Icon>account_circle</Icon>
      );
    }

    return (
        <div>
         <IconButton
          color="inherit"
          aria-label="UserMenu"
          onClick={this.handleOpenMenu}>
            { elemToRender }
         </IconButton>
          <Menu
            id='UserMenu'
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleCloseMenu}>
            { avatarURL ?
              <MenuItem onClick={revokeUserAuthorization}>Выйти</MenuItem> :
              <MenuItem component='a' href={oauth2URL}>Войти</MenuItem> }
          </Menu>
        </div>
    );
  }
};

const mapStateToProps = (state) => ({
  avatarURL: state.avatarURL  
});

const mapDispatchToProps = (dispatch) => ({
  revokeUserAuthorization() {
    dispatch(revokeUserAuthorization());
  }
});

UserMenu.propTypes = {
  avatarURL: PropTypes.string,
  revokeUserAuthorization: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);