import RPi.GPIO as GPIO
import time
import pyodbc
from writeFromRPIToDb import post

start_time = time.time()
counter = 0
occupancyValue = '0'

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(26, GPIO.IN)
                
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
