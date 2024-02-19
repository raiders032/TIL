{
  "header":{
    "targetServiceName": "com.tmax.superobject.admin.master.CreateDataSource",
    "messageType" : "REQUEST"
  },
  "body":{
    "dataSourceName" : "ims_1",
    "jdbcUrl" : "jdbc:tibero:thin:@192.168.159.41:31113:tibero",
    "user" : "ys",
    "password" : "ys",
    "maxTotal": 100,
    "testWhileIdle": true,
    "testOnBorrow": true,
    "testOnCreate": true,
    "validationQuery": "SELECT 1 from dual;",
    "maxWaitMillis": 10000,
    "maxIdle": 100,
    "minIdle": 2,
    "poolPreparedStatements": false,
    "timeBetweenEvictionRunsMillis": 600000
  }
}