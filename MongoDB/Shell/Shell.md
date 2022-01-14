# MongoDB connection

```
mongo --host mongodb0.example.com --port 27017
mongo --host 192.168.153.49
```

`--host <hostname>`

*  mongod 또는 mongos 실행중인 호스트 머신의 이름을 명시
* `--host`를 명시하지 않으면 자동으로 로컬 호스트로 인식한다.

`--port <port>`

* mongod or mongos instance가 리스닝 중인 포트를 명시한다.
* --port 옵션이 없으면 mongo는 자동으로 27017포트로 연결한다.



참고

* https://docs.mongodb.com/manual/reference/program/mongo/