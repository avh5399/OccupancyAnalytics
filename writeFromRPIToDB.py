import pyodbc
#> sudo apt-get install freetds-dev freetds-bin unixodbc-dev tdsodbc
#> pip3 install pyodbc sqlalchemy

<<<<<<< HEAD

def post(occupancyValue, driver, server, database, username, password):
    with pyodbc.connect('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
=======
# Make sure you have /etc/odbcinst.ini with the following inside:
# (If you don't, then create a file, put the following inside:)
#    [FreeTDS]
#    Description=FreeTDS Driver
#    Driver=/usr/lib/arm-linux-gnueabihf/odbc/libtdsodbc.so
#    Setup=/usr/lib/arm-linux-gnueabihf/odbc/libtdsS.so
# and then copy it into the /etc file (use sudo, if permissions deny it)

sensorid = '1'
occupancyValue = '0'

server = 'room-occupancy.database.windows.net'
database = 'RoomsDB'
username = 'user'
password = 'Capstone20'
driver= 'FreeTDS'


def post(occupancyValue, roomID):
    with pyodbc.connect('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password + ';TDS_Version=8.0') as conn:
>>>>>>> 8632c9abe522fa634bd80e56ce68813c207b5432
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM sensors")
            #If room Does not exist
            #cursor.execute("insert into rooms(room_id, occupancy) values (?, ?)", roomID, occupancyValue)

            #If room does exist
            cursor.execute("UPDATE sensors SET occupancy = ? WHERE sensor_id = ?;", str(occupancyValue), sensorid)

            cursor.execute("SELECT * FROM sensors")
            row = cursor.fetchone()
            while row:
                print (str(row[0]) + " " + str(row[1]))
                row = cursor.fetchone()
            
