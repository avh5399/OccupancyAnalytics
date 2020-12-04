import RPi.GPIO as GPIO
import time
start_time = time.time()

current_occupancy = "Not Occupied"
counter = 0

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(26, GPIO.IN)

while True:
    i=GPIO.input(26)

    if i==0:
        print ("No intruders",i)
    if i==1:
        print ("Intruder detected", i) 
        counter += 1
        
    if counter > 5:
        current_occupancy = "Occupied"
    
    current_time = time.time()
    elapsed_time = current_time - start_time
    
    if (elasped_time > 60):
        #return current_occupancy
        print(current_occupancy)
        current_occupancy = "Not Occupied"
        counter = 0
        start_time = time.time()
