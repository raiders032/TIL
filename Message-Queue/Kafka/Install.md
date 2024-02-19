# 1 Kafka Helm Chart로 설치하기

- https://artifacthub.io/packages/helm/bitnami/kafka


```
Kafka can be accessed by consumers via port 9092 on the following DNS name from within your cluster:

    my-kafka.myshop-develop.svc.cluster.local

Each Kafka broker can be accessed by producers via port 9092 on the following DNS name(s) from within your cluster:

    my-kafka-0.my-kafka-headless.myshop-develop.svc.cluster.local:9092

To create a pod that you can use as a Kafka client run the following commands:

    kubectl run my-kafka-client --restart='Never' --image docker.io/bitnami/kafka:3.5.1-debian-11-r1 --namespace myshop-develop --command -- sleep infinity
    kubectl exec --tty -i my-kafka-client --namespace myshop-develop -- bash

    PRODUCER:
        kafka-console-producer.sh \
            --broker-list my-kafka-0.my-kafka-headless.myshop-develop.svc.cluster.local:9092 \
            --topic test

    CONSUMER:
        kafka-console-consumer.sh \
            --bootstrap-server my-kafka.myshop-develop.svc.cluster.local:9092 \
            --topic test \
            --from-beginning
```