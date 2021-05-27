import sqlite3


class TableData:
    def __init__(self, database_name, table_name):
        self.table_name = table_name
        self.conn = sqlite3.connect(database_name)
        self.cursor = self.conn.cursor()

    def __len__(self):
        self.cursor.execute(f"SELECT * from {self.table_name}")
        data = self.cursor.fetchall()
        return len(data)

    def __getitem__(self, item):
        self.cursor.execute(
            f"SELECT * from {self.table_name} where name=:name", {"name": item}
        )
        data = self.cursor.fetchall()
        return data

    def __contains__(self, item):
        self.cursor.execute(f"SELECT * from {self.table_name}")
        for record in self.cursor.fetchall():
            if item in record:
                return True
            pass

    # def __iter__(self):
    #     self.conn.row_factory = sqlite3.Row
    #     self.cur = self.conn.cursor()
    #     return self.cur.execute(f'SELECT * from {self.table_name}').fetchone()
    #
    # def __next__(self):
    #     self.conn.row_factory = sqlite3.Row
    #     self.cur = self.conn.cursor()
    #     return self.cur.execute(f'SELECT * from {self.table_name}').fetchone()


if __name__ == "__main__":
    presidents = TableData(database_name="example.sqlite", table_name="presidents")
    print(len(presidents))
    print(presidents["Yeltsin"])
    print("Yeltsin" in presidents)
    # for president in presidents:
    #     print(tuple(president))

    books = TableData(database_name="example.sqlite", table_name="books")
    print(len(books))
    print(books["1984"])
    print("Bradbury" in books)
    # for president in presidents:
    #     print(president)
