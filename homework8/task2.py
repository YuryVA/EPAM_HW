import sqlite3


class TableData:
    def __init__(self, database_name, table_name):
        self.database_name = database_name
        self.table_name = table_name

    def __len__(self):
        """return length of sql table"""

        with sqlite3.connect(self.database_name) as conn:
            self.cursor = conn.cursor()
            (n,) = self.cursor.execute(
                f"SELECT COUNT(*) from {self.table_name}"
            ).fetchone()
        return n

    def __getitem__(self, item):
        """return TableData[item] row"""

        with sqlite3.connect(self.database_name) as conn:
            self.cursor = conn.cursor()
            self.cursor.execute(
                f"SELECT * from {self.table_name} where name=:name", {"name": item}
            )
            data = self.cursor.fetchall()
        return data

    def __contains__(self, item):
        """check if item in TableData"""

        with sqlite3.connect(self.database_name) as conn:
            self.cursor = conn.cursor()
            for row in self.cursor.execute(f"SELECT * from {self.table_name}"):
                if item in row:
                    return True
                pass

    def __iter__(self):
        """implements iteration protocol"""
        self.conn = sqlite3.connect(self.database_name)
        self.cursor = self.conn.cursor()
        self.cursor.execute(f"SELECT * from {self.table_name}")
        return self

    def __next__(self):
        result = self.cursor.fetchone()
        while result:
            return result
        self.cursor.close()
        self.conn.close()
        raise StopIteration
