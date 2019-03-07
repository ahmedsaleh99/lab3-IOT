#include <WebSocketsClient.h>

#define SERVER_IP "192.168.43.93"
#define PORT_NUM 3000
#define URL "/"

const char* ssid = "smartech";
const char* password = "12345678";

WebSocketsClient webSocket;

uint8_t i = 0;

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {

  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[WSc] Disconnected!\n");
      break;

    case WStype_CONNECTED:
      Serial.printf("[WSc] Connected to url: %s\n", payload);
      webSocket.sendTXT("{\"type\":\"node_connected\",\"data\":\"hello\"}");

      break;

    case WStype_TEXT:
      Serial.printf("Recieved data : %s\n", payload);
      if ( strstr((const char*)payload, "ON") ) {
        digitalWrite(2, HIGH);
      } else if (  strstr((const char*)payload, "OFF") ) {
        digitalWrite(2, LOW);
      }
      break;

  }

}

void setup() {

  pinMode (2, OUTPUT);
  
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

  webSocket.begin(SERVER_IP, PORT_NUM, URL);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(500);

}

void loop() {
  webSocket.loop();
  int x = analogRead(A0);
  String s = "{\"type\":\"sensor\",\"data\":" + String(x) + "}";
  webSocket.sendTXT(s);
//  webSocket.sendTXT("{\"type\":\"sensor\",\"data\":\"5\"}");

  delay(1000);
}

