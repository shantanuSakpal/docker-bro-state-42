import {Kafka} from "kafkajs"


const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka1:9092', 'kafka2:9092'], // Add all Kafka broker addresses here
});

export default kafka;