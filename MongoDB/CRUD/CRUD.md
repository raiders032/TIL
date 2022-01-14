# MongoDB CRUD Operations

# 1 Insert Documents

* 만약 document의 _id가 명시되지 않으면 MongoDB가 자동 할당
* 존재하지 않는 collection에 document를 삽입하면 collection이 자동으로 만들어진다.
* 두 가지의 삽입 메소드를 제공
  * db.collection.insertOne()
  * db.collection.insertMany()




**inventory(collection)에 새로운 document 하나를 삽입**

```bash
db.inventory.insertOne(
   { item: "canvas", qty: 100, tags: ["cotton"], size: { h: 28, w: 35.5, uom: "cm" } }
)
```



**여러개 document 한번에 삽입**

```bash
db.inventory.insertMany([
   { item: "journal", qty: 25, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" } },
   { item: "mat", qty: 85, tags: ["gray"], size: { h: 27.9, w: 35.5, uom: "cm" } },
   { item: "mousepad", qty: 25, tags: ["gel", "blue"], size: { h: 19, w: 22.85, uom: "cm" } }
])
```



> 참고
>
> https://docs.mongodb.com/manual/crud/#create-operations
>
> https://docs.mongodb.com/manual/tutorial/insert-documents/



# 2 Query Documents

* collection에서 documents 조회하기
* MongoDB은 아래와 같은 조회 메소드를 제공한다.
  * db.collection.find()

![The components of a MongoDB find operation.](https://docs.mongodb.com/manual/images/crud-annotated-mongodb-find.bakedsvg.svg)



> 참고
>
> https://docs.mongodb.com/manual/crud/#read-operations



```
db.KOSPI.find({"DATE" : { $gte : new ISODate("2021-12-20T00:00:00Z") }});
```







**참고**

* https://docs.mongodb.com/manual/crud/