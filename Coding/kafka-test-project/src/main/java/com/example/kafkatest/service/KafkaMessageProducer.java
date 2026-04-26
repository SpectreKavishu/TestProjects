package com.example.kafkatest.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaMessageProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final String topicName;

    public KafkaMessageProducer(
            KafkaTemplate<String, String> kafkaTemplate,
            @Value("${app.kafka.topic}") String topicName) {
        this.kafkaTemplate = kafkaTemplate;
        this.topicName = topicName;
    }

    public void send(String message) {
        kafkaTemplate.send(topicName, message);
    }
}
