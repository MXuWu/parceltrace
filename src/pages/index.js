import React from 'react';
import axios from 'axios';
// import fetch from 'isomor'

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
    marginLeft: '10%',
    marginRight: '10%', 
    // padding: '0px 50px 0px 50px',
  }
}

class Home extends React.Component{

  static async getInitialProps() {


    const tempFeed = await axios('https://api.thingspeak.com/channels/569505/feeds.json?results=1000')

    
    return { tempFeed: tempFeed.data.feeds };
  
  }

  render() {
  
    const { classes, tempFeed } = this.props;

    return(
      <div className={ classes.root }>
        <Header/>

        <main className= { classes.main }>
          <Charts initTempFeed={tempFeed} />
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(Home);