import RPi.GPIO as GPIO
import time
import pyodbc

start_time = time.time()
counter = 0
roomID = '1'
occupancyValue = '0'
server = 'room-occupancy.database.windows.net'
database = 'RoomsDB'
username = 'user'
password = 'Capstone20'
driver= '{ODBC Driver 17 for SQL Server}'

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(26, GPIO.IN)

def post(occupancyValue):
    with pyodbc.connect('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM rooms")
            #If room Does not exist
            #cursor.execute("insert into rooms(room_id, occupancy) values (?, ?)", roomID, occupancyValue)

            #If room does exist
            cursor.execute("UPDATE rooms SET occupancy = ? WHERE room_id = ?;", occupancyValue, roomID)

            cursor.execute("SELECT * FROM rooms")
            row = cursor.fetchone()
            while row:
                print (str(row[0]) + " " + str(row[1]))
                row = cursor.fetchone()
                
while True:
    i=GPIO.input(26)
    
    if i==1:
        counter += 1
        
    if counter > 5:
        occupancyValue = '1'
    
    current_time = time.time()
    elapsed_time = current_time - start_time
    
    if (elasped_time > 60):
        post(occupancyValue)
        occupancyValue = '0'
        counter = 0
        start_time = time.time()
