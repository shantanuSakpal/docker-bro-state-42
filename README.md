# docker-bro-state-42
## This is  a web app for monitoring docker containers 
### Made by the ultimate colab of BROgrammers and Random_State_42


bin/zookeeper-server-start.sh config/zookeeper.properties
bin/kafka-server-start.sh config/server.properties
bin/kafka-console-producer.sh --topic quickstart-events --bootstrap-server localhost:9092
bin/kafka-console-consumer.sh --topic quickstart-events --from-beginning --bootstrap-server localhost:9092