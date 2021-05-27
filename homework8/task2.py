import sqlite3


class TableData:
    def __init__(self, database_name, table_name):
        self.table_name = table_name
        self.conn = sqlite3.connect(database_name)
        self.cursor = self.conn.cursor()

    def __len__(self):
        """return length of sql table"""

        n = 0
        for row in self.cursor.execute(f"SELECT * from {self.table_name}"):
            n += 1
        return n

    def __getitem__(self, item):
        """return TableData[item] row"""

        self.cursor.execute(
            f"SELECT * from {self.table_name} where name=:name", {"name": item}
        )
        data = self.cursor.fetchall()
        return data

    def __contains__(self, item):
        """check if item in TableData"""

        for row in self.cursor.execute(f"SELECT * from {self.table_name}"):
            if item in row:
                return True
            pass

    def __iter__(self):
        """implements iteration protocol"""

        self.cursor.execute(f"SELECT * from {self.table_name}")
        return self

    def __next__(self):
        result = self.cursor.fetchone()
        while result:
            return result
        raise StopIteration
