import pyodbc
#pip3 install pyodbc
#if that fails and you're on macOS, try brew install unixodbc and then pip3 install pyodbc
#still errors? Try this https://github.com/mkleehammer/pyodbc/issues/717 and https://docs.microsoft.com/en-us/sql/connect/odbc/linux-mac/install-microsoft-odbc-driver-sql-server-macos?view=sql-server-ver15

roomID = '1'
occupancyValue = '123123123123'

server = 'room-occupancy.database.windows.net'
database = 'RoomsDB'
username = 'user'
password = 'Capstone20'
driver= '{ODBC Driver 17 for SQL Server}'



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

####################

# Specifying the ODBC driver, server name, database, etc. directly
#cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=room-occupancy.database.windows.net;DATABASE=RoomsDB;UID=user;PWD=Capstone20')

# Create a cursor from the connection
#cursor = cnxn.cursor()

#if the room does not exist
#cursor.execute("insert into rooms(room_id, occupancy) values (?, ?)", occupancyValue, roomID)

#else [if] the room does exist
#cursor.execute("UPDATE rooms SET occupancy = ? WHERE room_id = ?;", occupancyValue, roomID)

#cnxn.commit()
