import sqlite3

#connection and cursor
connection = sqlite3.connect('occupancyDB.db')
cursor = connection.cursor()

#create rooms db 
createRoom_cmd = """CREATE TABLE IF NOT EXISTS
rooms(room_id INTEGER PRIMARY KEY, occupancy TEXT)"""

cursor.execute(createRoom_cmd)

#command to add entries to rooms db
cursor.execute("INSERT INTO rooms VALUES (1, '10')")
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
