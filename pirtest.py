import RPi.GPIO as GPIO
import time
start = time.time()

current_occupancy = "Not Occupied"
counter = 0


GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(26, GPIO.IN)

while True:
    i=GPIO.input(26)
    if i==0:
        print ("No intruders",i)
        #current_occupancy = "Not occupied"
        counter += 1
        #time.sleep(1)
    if i==1:
        print ("Intruder detected", i) 
        #current_occupancy = "Occupied"
        counter = 0;
        #time.sleep(1)
    #print(current_occupancy)
    if counter > 5:
        print("not occupied")
    else:
        print("occupied")
    time.sleep(2.0 - ((time.time() - start) % 2.0))