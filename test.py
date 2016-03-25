#coding=utf8
import MySQLdb

if __name__ == '__main__':
    """
    Mysqldb 与 防止sql注入
    """
    # -------------------------------  NEW
    # s = ((3, 12, "hello1", "world1"),
    #      (4, 13, "hello2", "world2"),
    #      (5, 14, "hello3", "world3"))
    s = ((3, "aaa' or '' ='"),
         (3, "aaa' or '' ='"),)
    conn = MySQLdb.Connect(host="127.0.0.1", port=3306, user="root", passwd="123123", db="EMP", charset="utf8")
    cursor = conn.cursor()
    # sql = "INSERT INTO Employees (id, age, frist, `last`) VALUES (%s, %s, %s, %s)"
    for e in s:
        print e
        sql = "SELECT * FROM Employees WHERE id='%s' and age='%s'"  % e
        cursor.execute(sql)
        # conn.commit()
        print cursor.fetchall()






