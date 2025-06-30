import psycopg2

def get_connection():
    return psycopg2.connect(
        host="dpg-d1hci42dbo4c73a6nkhg-a.oregon-postgres.render.com",
        user="root",
        password="0FPzFDYo8FLzXgXPLIEKcinuUjNIogVk",
        dbname="cadastro_logistico",
        port=5432
    )
