import paho.mqtt.client as mqtt
import json 
import sqlite3

#global variables
MQTT_BROKER = "mqtt.eclipse.org"
PORT = 1883
INTERVAL = 60
TOPIC = "RPi/PIR1/"

class sensorData():
    def __init__(self, room_id, occupancy):
        self.room_id = room_id
        self.occupancy = occupancy



# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    if(rc != 0):
        print("Unable to connect")
        pass
    else:
        print("Connected with result code "+str(rc))
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe(TOPIC, 0)


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print("MQTT data recieved")
    #print(msg.topic+" "+str(msg.payload))

def on_subscribe(client, userdata, mid, granted_qos):
    pass

def publishSensorData(topic, data):
    client.publish(topic, data)
    print("Published: " +str(data)+ " to topic " +str(topic)+"\n")

def sendSensorDataToDB(data):
    data_json = [
        {
            'room_id': data.room_id,
            'occupancy': data.occupancy
        }
    ]


#connection and cursor
connection = sqlite3.connect('occupancyDB.db')
cursor = connection.cursor()

#create rooms db 
createRoom_cmd = """CREATE TABLE IF NOT EXISTS
rooms(room_id INTEGER PRIMARY KEY, occupancy TEXT)"""

cursor.execute(createRoom_cmd)

testdata1 = sensorData(1,10)
testdata2 = sensorData(2,13)

#command to add entries to rooms db
cursor.execute("INSERT INTO rooms VALUES ("+str(testdata1.room_id)+", "+str(testdata1.occupancy)+")")
cursor.execute("INSERT INTO rooms VALUES (2, '13')")
cursor.execute("INSERT INTO rooms VALUES (3, '15')")
cursor.execute("INSERT INTO rooms VALUES (4, '20')")

#test db 
cursor.execute("SELECT * FROM rooms")
#cursor.execute("SELECT * FROM rooms WHERE room_id LIKE 1")

#print reuslts 
results = cursor.fetchall()
print(results)

#close the connections to the DB
cursor.close()
connection.close()

client = mqtt.Client(client_id="test")

client.on_connect = on_connect
client.on_message = on_message
client.on_subscribe = on_subscribe

client.connect(MQTT_BROKER, PORT, INTERVAL)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()