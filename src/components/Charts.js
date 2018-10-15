import React from 'react';


import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grid';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { withStyles } from '@material-ui/core/styles';

import TempChart from './TempChart';

import axios from 'axios';

const styles = {
  root: {
  }, 
  header: {
    paddingLeft: 20,
  }, 
  gridItems: {
    display: 'flex',
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',
  }
}

class Charts extends React.Component{
  
  state={
    gpsData: {},
    tempFeed: {},
    tempMenu: false,
    tempOption: 'Most Recent',
    updated: false,
  }

  componentDidMount = () => {
    // this.updateData();
    // tick every 60sec/1min
    this.intervalID = setInterval(this.updateData, 60000);
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalID);
  }

  updateData = () => {
    let gpsData, tempFeed;
    // GPS request
    axios.get('https://api.thingspeak.com/channels/586557/feeds.json?results=1000')
    .then((response) => {
      gpsData = response.data.feeds;
      return axios.get('https://api.thingspeak.com/channels/569505/feeds.json?results=1000')
    })
    .then((response) => {
        tempFeed = response.data.feeds;
        this.setState({ gpsData: gpsData, tempFeed: tempFeed, updated: true });
    });
  }
  
  handleTempMenu = () => {
    this.setState({ tempMenu: !this.state.tempMenu})
  }

  render() {

    const { classes, initTempFeed } = this.props; 

    const { tempFeed, gpsData } = this.state; 

    return(
      <section>
        <Grid container direction="row">
          <Grid item className={ classes.gridItems } xs={6}>
            <Typography>
              Temperature and Humidity
            </Typography>

            <TempChart updated={false} initTempFeed={initTempFeed} tempFeed={tempFeed} />

          </Grid>


        </Grid>
      </section>
    );
  }

}

export default withStyles(styles)(Charts);