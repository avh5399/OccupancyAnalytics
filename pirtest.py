import RPi.GPIO as GPIO
import time
import pyodbc
from writeFromRPIToDb import post

start_time = time.time()
counter = 0
roomID = '1'
occupancyValue = '0'

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(26, GPIO.IN)
                
while True:
    i=GPIO.input(26)
    
    if i==1:
        counter += 1
        print("motion detected")
        
    if counter > 5:
        occupancyValue = '1'
    
    if ((time.time() - start_time) > 60):
        post(occupancyValue, roomID)
        occupancyValue = '0'
        counter = 0
        start_time = time.time()
