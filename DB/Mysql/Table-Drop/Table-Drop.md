# Using mysqldump

There’s another workaround with mysqldump which is faster and easier.

First, disable foreign key check:

```
echo "SET FOREIGN_KEY_CHECKS = 0;" > ./temp.sql
```

Then dump the db with no data and drop all tables:

```
mysqldump --add-drop-table --no-data -u root -p db_name | grep 'DROP TABLE' >> ./temp.sql
```

Turn the foreign key check back on:

```
echo "SET FOREIGN_KEY_CHECKS = 1;" >> ./temp.sql
```

Now restore the db with the dump file:

```
mysql -u root -p db_name < ./temp.sql
```



참고

- https://tableplus.com/blog/2018/08/mysql-how-to-drop-all-tables.html