import React from 'react';
import axios from 'axios';
import { compose, withProps } from 'recompose';


import { 
  GoogleMap, 
  withGoogleMap, 
  withScriptjs, 
  Polyline, 
  Marker 
} from 'react-google-maps';



import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column', 
    justifyCOntent: 'center',
    alignItems: 'center',
    width: '100%',
    // marginTop: ,
  }, 
}

class GPSChart extends React.Component{

  render() {
  
    const { classes, initGPSFeed, gpsFeed, updated } = this.props;
    
    const feeds = updated ? gpsFeed : initGPSFeed;
    // console.log(tempFeed);

    let selectFeeds = [];
    // // let lastInd = data.feeds.length - 1;
    // // let lastInd = 114;
    let numFeeds = 80;
    let feedsLength = updated ? gpsFeed.length : initGPSFeed.length;
    for (let i = (feedsLength - 1); i >= (feedsLength - numFeeds); i--) {
      selectFeeds.unshift(feeds[i]);
    }

    let pathCoords = [];
    let gpsData = selectFeeds.map((feed) => {
      let dataPoint = {
        date: feed.created_at, 
        lat: parseFloat(feed.field1),
        lng: parseFloat(feed.field2), 
        alt: feed.field4,
        speed: feed.field5,
      } 
      pathCoords.unshift({lat: dataPoint.lat, lng: dataPoint.lng});
      return dataPoint;
    })


    return(
      <div className={ classes.root }>
        <GoogleMap
          defaultZoom={8}
          defaultCenter={{ lat: -34.397, lng: 150.644 }}
        >
          <Polyline
            path={pathCoords}
            geodesic={true}
            options={{
              strokeColor: '#ff2b2b',
              strokeWeight: '3',

            }}
          />
          <Marker 
            label="A"
            position={
              { 
                lat: pathCoords[pathCoords.length-1].lat, 
                lng: pathCoords[pathCoords.length-1].lng
              }
            }
          />
          <Marker 
            label="B"
            position={
              { 
                lat: pathCoords[0].lat, 
                lng: pathCoords[0].lng
              }
            }
          />


          {/* {gpsData.map((dataPoint, index)=>{
            return (
              // console.log(parseFloat(dataPoint.lat));
              <Marker 
                key={index} 
                position={{ 
                  lat: parseFloat(dataPoint.lat), 
                  lng: parseFloat(dataPoint.lng), 
                }} 
                label={dataPoint.date}
              />
            )
          })} */}

        </GoogleMap>
      </div>
    );
  }
}

export default compose(
  withProps({
    // googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    googleMapURL:"https://maps.googleapis.com/maps/api/js?key=AIzaSyA-1o-x67SMMMuUB3vVGaOarAi8eVdxD_0",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ width: '85%', marginTop: 10}} />,
    mapElement: <div style={{ width:'100%', paddingTop: '56.25%' }} />,
  }),
  withScriptjs,
  withGoogleMap, 
  withStyles(styles),
)(GPSChart);