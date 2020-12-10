import RPi.GPIO as GPIO
import time
import pyodbc
from writeFromRPIToDB import post

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
GPIO.setup(11, GPIO.IN)
                
while True:
    i=GPIO.input(11)
    
    if i==1:
        counter += 1
        print("motion detected")
        
    if counter > 5:
        occupancyValue = '1'
        post(occupancyValue, roomID)
    
<<<<<<< HEAD
    current_time = time.time()
    elapsed_time = current_time - start_time
    
    if (elasped_time > 60):
        post(occupancyValue, driver, server, database, username, password)
=======
    if ((time.time() - start_time) > 60):
>>>>>>> 8632c9abe522fa634bd80e56ce68813c207b5432
        occupancyValue = '0'
        post(occupancyValue, roomID)
        counter = 0
        start_time = time.time()
