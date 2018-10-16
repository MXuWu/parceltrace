import React from 'react';
import axios from 'axios';

import Header from '../components/Header';
import Charts from '../components/Charts';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column', 
    justifyCOntent: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    flexGrow: 1,
  }, 
  main: {
    marginTop: 100,
    // width: '90%',
    marginLeft: '5%',
    marginRight: '5%', 
    // padding: '0px 50px 0px 50px',
  }
}

class Home extends React.Component{

  static async getInitialProps() {


    const tempFeed = await axios('https://api.thingspeak.com/channels/569505/feeds.json?results=1000')
    const gpsFeed = await axios('https://api.thingspeak.com/channels/586557/feeds.json?results=1000');


    
    return { tempFeed: tempFeed.data.feeds, gpsFeed: gpsFeed.data.feeds };
  
  }

  render() {
  
    const { classes, tempFeed, gpsFeed } = this.props;

    return(
      <div className={ classes.root }>
        <Header/>

        <main className= { classes.main }>
          <Charts initTempFeed={tempFeed} initGPSFeed={gpsFeed} />
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(Home);