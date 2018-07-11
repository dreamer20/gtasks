import React from 'react';
import Grid from '@material-ui/core/Grid';
import { oauth2URL } from '../oauth2/oauth2';

export default () => (
  <Grid container justify='center'>
    <Grid item md={6}>
    <header>
      <h1 style={{textAlign: 'center'}}>Вы не авторизованы</h1>
    </header>
    <div style={{textAlign: 'center'}}>
      <a href={oauth2URL}>
        Войти
      </a>
    </div>
    </Grid>
  </Grid>
);