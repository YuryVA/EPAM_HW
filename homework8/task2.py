import sqlite3


class TableData:
    def __init__(self, database_name, table_name):
        self.table_name = table_name
        self.conn = sqlite3.connect(database_name)
        self.cursor = self.conn.cursor()

    def __len__(self):
        n = 0
        for row in self.cursor.execute(f'SELECT * from {self.table_name}'):
            n += 1
        return n

    def __getitem__(self, item):
        self.cursor.execute(
            f"SELECT * from {self.table_name} where name=:name", {"name": item}
        )
        data = self.cursor.fetchall()
        return data

    def __contains__(self, item):
        for record in self.cursor.execute(f"SELECT * from {self.table_name}"):
            if item in record:
                return True
            pass

    def __iter__(self):
        self.cursor.execute(f"SELECT * from {self.table_name}")
        return self

    def __next__(self):
        result = self.cursor.fetchone()
        while result:
            return result
        raise StopIteration

#
# if __name__ == "__main__":
#     presidents = TableData(database_name="example.sqlite", table_name="presidents")
#     print(len(presidents))
#     print(presidents["Yeltsin"])
#     print("Yeltsin" in presidents)
#     for president in presidents:
#         print(president)
#
#     books = TableData(database_name="example.sqlite", table_name="books")
#     print(len(books))
#     print(books["1984"])
#     print("Bradbury" in books)
#     for book in books:
#         print(book)
