import React from 'react';


import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import TempChart from './TempChart';
import GPSChart from './GPSChart';

import axios from 'axios';

const styles = {
  root: {
  }, 
  header: {
    paddingLeft: 20,
  }, 
  gridItem: {
    display: 'flex',
    flexDirection: 'column', 
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '40px',
  },
  
}

class Charts extends React.Component{
  
  state={
    gpsFeed: {},
    tempFeed: {},
    tempMenu: false,
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

  updateData = async () => {
    // let gpsFeed, tempFeed;
    // // GPS request
    // axios.get('https://api.thingspeak.com/channels/586557/feeds.json?results=1000')
    // .then((response) => {
    //   gpsData = response.data.feeds;
    //   return axios.get('https://api.thingspeak.com/channels/569505/feeds.json?results=1000')
    // })
    // .then((response) => {
    //     tempFeed = response.data.feeds;
    //     this.setState({ gpsData: gpsData, tempFeed: tempFeed, updated: true });
    // });

    const gpsFeed = await axios('https://api.thingspeak.com/channels/586557/feeds.json?results=1000');
    const tempFeed = await axios('https://api.thingspeak.com/channels/569505/feeds.json?results=1000');

    if (gpsFeed !== this.state.gpsFeed){
      this.setState({gpsFeed: gpsFeed, tempFeed: tempFeed});
    }

  }
  
  handleTempMenu = () => {
    this.setState({ tempMenu: !this.state.tempMenu})
  }

  render() {

    const { classes, initTempFeed, initGPSFeed } = this.props; 

    const { tempFeed, gpsFeed, updated } = this.state; 

    return(
      <section>
        <Grid container direction="row"  spacing={40}>
          {/* MAP */}
          <Grid item className={ classes.gridItem } xs={12}>
            <Typography variant="headline">
              Location
            </Typography>

            <GPSChart 
                updated={updated}
                initGPSFeed={initGPSFeed}
                gpsFeed={gpsFeed}
            />

          </Grid>

          {/* TEMPERATURE GRAPH */}
          <Grid item className={ classes.gridItem } xs={12}>
            <Typography variant='headline'>
              Temperature and Humidity
            </Typography>

            <TempChart 
              updated={updated} 
              initTempFeed={initTempFeed} 
              tempFeed={tempFeed} 
            />
          </Grid>

         
            


        </Grid>
      </section>
    );
  }

}

export default withStyles(styles)(Charts);