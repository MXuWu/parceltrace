import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Toolbar } from '@material-ui/core';

const styles = {
  root: {
  }, 
  appBar: {
    background: 'white',
  },
  header: {
    paddingLeft: '15px',
    color: '#00275b',
    fontFamily: 'Montserrat, sans-serif',
  }
}

class Header extends React.Component {
  render() {

    const { classes } = this.props;
    
    return(
      <div>
        <AppBar className={ classes.appBar }>
          <Toolbar>
            <Typography className={ classes.header } variant="headline">
              ParcelTrace
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Header);