import RPi.GPIO as GPIO
import time
import pyodbc
from writeFromRPIToDB import post

start_time = time.time()
counter = 0
roomID = '1'
occupancyValue = '0'

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
    
    if ((time.time() - start_time) > 60):
        occupancyValue = '0'
        post(occupancyValue, roomID)
        counter = 0
        start_time = time.time()
