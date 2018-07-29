import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';

class ModalDialog extends Component {

  render() {
    const { settings, classes } = this.props;
    const { isOpen, handler, action, onClose } = settings;

    let title, btnTitle;
    if (action === 'delete') {
      title = 'Удалить елемент?';
      btnTitle='Удалить';
    } else if (action === 'edit') {
      title = 'Сохнанить изменения?';
      btnTitle='Сохранить';
    }

    return (
      <Modal open={isOpen} >
        <div style={getModalStyle()} className={classes.paper}>
          <Typography
            align='center'
            variant='title'
            gutterBottom>
              {title}
          </Typography>
          <div className={classes.modalBtnGroup}>
            <Button color='secondary' onClick={handler}>{btnTitle}</Button>
            <Button onClick={onClose}>Отменить</Button>
          </div>
        </div>
      </Modal>
    );
  }
}

const getModalStyle = () => {
  return {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)'
  }
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    '@media (max-width:600px)': {
      width: theme.spacing.unit * 40,
      padding: theme.spacing.unit * 2
    },
  },
  modalBtnGroup: {
    display: 'flex',
    justifyContent: 'space-between'
  }
})

export default withStyles(styles)(ModalDialog);