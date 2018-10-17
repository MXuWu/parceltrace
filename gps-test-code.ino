#include <Adafruit_DHT.h>
#include <TinyGPS++.h>
#include <TinyGPS++/TinyGPS++.h>

// Definitions
#define DHTTYPE DHT11
#define DHT_5V_PIN D1
#define DHT_SENSOR_PIN D2
#define DHT_GROUND_PIN D4
#define SECOND 1000
static const uint32_t GPSBaud = 9600;

#define TRANSMIT_DATA true

// Globals
//static const int RXPin = 4, TXPin = 3;
char placeholderStr[128];
int hdopValue = -1;
float latitude;
float longitude;
float altitude;
int num_satellites;
int age;
char date[32] = {};
float courseSpeed;
float temp;
float humidity;

// transmission variables
unsigned long lastTime = 0;
unsigned long lastTimeGPS = 0;
unsigned long send_gps_delay = 30 * 1000; // 2 minute delay -> 120 * 1000
unsigned long send_temperature_delay = 120 * 1000; // 2 minute delay -> 120 * 1000

// The TinyGPS++ object
TinyGPSPlus gps;
DHT dht(DHT_SENSOR_PIN, DHTTYPE);

void setup()
{
  // Give power to the sensor
  pinMode(DHT_5V_PIN, OUTPUT);
  pinMode(DHT_GROUND_PIN, OUTPUT);
  digitalWrite(DHT_GROUND_PIN, LOW);
  digitalWrite(DHT_5V_PIN, HIGH);
  Serial.begin(115200);
  Serial1.begin(GPSBaud);
//   lastTime = millis();
}

void loop()
{
  // Modified delay function to allow parsing of GPS data during delay
  smartDelay(500);
  
  handleTempSensor();
  
  handleGPS();
  
  // Handling of uploading data to ThingSpeak via Webhook
  
  if (TRANSMIT_DATA){
      if (gps.location.isValid()){
          if (latitude != 0.0 && longitude != 0.0){
            unsigned long now = millis();
            // Can adjust send_gps_delay at beginning of this page
        	  if ((now - lastTimeGPS) >= send_gps_delay) {
        		lastTimeGPS = now;
        		Serial.print("Sending GPS Event INFO ");
                sendGPSData(latitude, longitude, num_satellites, altitude, courseSpeed);
        	  }  
          }
      }
  }
  smartDelay(1000);
}

static void handleGPS(){
  // Accuracy of the fix
  if (gps.hdop.isValid()){
      hdopValue = gps.hdop.value();
      sprintf(placeholderStr,"HDOP value %d", hdopValue);
      Serial.print("HDOP value: ");
      Serial.println(placeholderStr);
  }
  // Lat/Long
  if (gps.location.isValid()){
    latitude = gps.location.lat();
    longitude = gps.location.lng();
    sprintf(placeholderStr,"Lat/Long value: %f:%f", latitude, longitude);
    Serial.println(placeholderStr);
    // Age of Data
    age = gps.location.age();
    sprintf(placeholderStr,"Fix age: %d", age);
    Serial.println(placeholderStr);
  }
  else{
    Serial.println(F("No fix has been found yet"));
  }

  if (gps.altitude.isValid()){
    altitude = gps.altitude.meters();
    sprintf(placeholderStr,"Altitude: %fm", altitude);
    Serial.println(placeholderStr);
  }

  if (gps.speed.isValid()){
    courseSpeed = gps.speed.kmph();
    sprintf(placeholderStr,"Speed: %f kmph", courseSpeed);
    Serial.println(placeholderStr);
  }

  if (gps.satellites.isValid()){
    num_satellites = gps.satellites.value();
    sprintf(placeholderStr,"Current satellites: %d", num_satellites);
    Serial.println(placeholderStr);
  }

  Serial.println('\n\n');
  if (millis() > 5000 && gps.charsProcessed() < 10){
    Serial.println(F("No GPS data received: check wiring"));
  }
}

void handleTempSensor(){
    temp = dht.getTempCelcius();
    humidity = dht.getHumidity();
    unsigned long now = millis();
    
    sprintf(placeholderStr,"Temp: %f Humidity: %f%", temp, humidity);
    Serial.println(placeholderStr);
    
    if (TRANSMIT_DATA){
        if (temp != 0.0 && humidity != 0.0)
        // Can adjust send_gps_delay at beginning of this page
        if ((now - lastTime) >= send_temperature_delay) {
        	lastTime = now;
        	Serial.println("-----------ATTEMPTING TO SEND GPS EVENT ----------------------");
            sendTempandHumidity(humidity, temp);
        }
    }
}


// This custom version of delay() ensures that the gps object is being "fed".
static void smartDelay(unsigned long ms)
{
  unsigned long start = millis();
  do 
  {
    while (Serial1.available())
      gps.encode(Serial1.read());
  } while (millis() - start < ms);
}

void sendTempandHumidity(float humid, float temp){
    String eventName = "tS_Temperature";
    char msg[256];
    
    snprintf(msg, sizeof(msg), 
// Temperature #1  , Humidity Field #2   ,  ThingSpeak WriteKey  
   "{\"1\":\"%.1f\"     ,   \"2\":\"%.1f\"      ,   \"k\":\"%s\"}"      ,
// Float for Field #1   , Float for Field #2    ,  ThingSpeak WriteKey     
        temp          ,       humid          ,   "6U0ET7DKNSRGT0NN")      ;

    Particle.publish(eventName, msg, PRIVATE);
}

void sendGPSData(float lat, float lng, int numSats, float altitude, float speed){
    String eventName = "ts_GPS";
    char msg[256];
    
    snprintf(msg, sizeof(msg), 
// Temperature #1  , Humidity Field #2   ,  ThingSpeak WriteKey  
   "{\"1\":\"%.6f\"     ,   \"2\":\"%.6f\"      ,   \"3\":\"%d\"    ,   \"4\":\"%.1f\"  , \"5\":\"%.1f\",  \"k\":\"%s\"}"  ,
// Float for Field #1   , Float for Field #2    ,  ThingSpeak WriteKey     
        lat         ,       lng          ,          numSats          ,  altitude        ,    speed   ,   "7VYC9Q7VP69QCUBH")      ;
    Serial.println("-----------ATTEMPTING TO SEND EVENT ----------------------");

    Particle.publish(eventName, msg, PRIVATE);
}

static void printStr(const char *str, int len)
{
  int slen = strlen(str);
  for (int i=0; i<len; ++i)
    Serial.print(i<slen ? str[i] : ' ');
  smartDelay(0);
}

// Sample code example for handling delayed transmissions without affecting data usage
// void sampleCode(){
//     unsigned Long lastTime = 0;
//     unsigned long now = millis();
// 	if ((now - lastTime) >= 1000) {
// 		lastTime = now;
// 		Serial.printlnf("%lu", now);
// 	}
// }


// static void printDateTime(TinyGPSDate &d, TinyGPSTime &t)
// {
//   if (!d.isValid())
//   {
//     Serial.print(F("********** "));
//   }
//   else
//   {
//     char sz[32];
//     sprintf(sz, "%02d/%02d/%02d ", d.month(), d.day(), d.year());
//     Serial.print(sz);
//   }
  
//   if (!t.isValid())
//   {
//     Serial.print(F("******** "));
//   }
//   else
//   {
//     char sz[32];
//     sprintf(sz, "%02d:%02d:%02d ", t.hour(), t.minute(), t.second());
//     Serial.print(sz);
//   }

//   printInt(d.age(), d.isValid(), 5);
//   smartDelay(0);
// }
