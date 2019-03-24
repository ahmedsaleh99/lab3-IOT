#include <WebSocketsClient.h>

#define SERVER_IP "192.168.1.5"
#define PORT_NUM 3000
#define URL "/"

const char* ssid = "ase_1930";
const char* password = "Bb1234567890";

WebSocketsClient webSocket;

int i = 0;
int ledPin = D0;

void setup() {

  pinMode (ledPin, OUTPUT);

  Serial.begin(115200);

  WiFi.begin(ssid, password);
  delay(100);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println(".");
  }

  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  //intializing web socket node client

  webSocket.begin(SERVER_IP, PORT_NUM, URL);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(500);

}

void loop() {
  webSocket.loop();
  //int x = analogRead(A0);
  //String s = "{\"type\":\"sensor\",\"data\":" + String(x) + "}";
  //webSocket.sendTXT(s);
  //  webSocket.sendTXT("{\"type\":\"sensor\",\"data\":\"5\"}");

  delay(1);
}

//callback to will be executed if webseocket event is fired such as (on connection , on disconnection, on message)
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {

  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[WSc] Disconnected!\n");
      break;

    case WStype_CONNECTED:
      Serial.printf("[WSc] Connected to url: %s\n", payload);
    
      if (digitalRead(ledPin)) {
       webSocket.sendTXT("{\"type\":\"node_connected\",\"data\":\"On\"}");
       Serial.println("Led On");
      }
      else {
      webSocket.sendTXT("{\"type\":\"node_connected\",\"data\":\"Off\"}");
      Serial.println("Led Off");
      }
      
      break;
    case WStype_TEXT:
      Serial.printf("Recieved data : %s\n", payload);
      if ( strstr((const char*)payload, "On") ) {
        digitalWrite(ledPin, HIGH);
        
      } else if (  strstr((const char*)payload, "Off") ) {
        digitalWrite(ledPin, LOW);
      }
      if (digitalRead(ledPin)) {
       webSocket.sendTXT("{\"type\":\"node\",\"data\":\"On\"}");
       Serial.println("Led On");
      }
      else {
      webSocket.sendTXT("{\"type\":\"node\",\"data\":\"Off\"}");
      Serial.println("Led Off");
      }
      break;

  }

}
