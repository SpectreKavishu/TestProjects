package com.example.kafkatest.controller;

import com.example.kafkatest.model.MessageRequest;
import com.example.kafkatest.service.KafkaMessageConsumer;
import com.example.kafkatest.service.KafkaMessageProducer;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final KafkaMessageProducer producer;
    private final KafkaMessageConsumer consumer;

    public MessageController(KafkaMessageProducer producer, KafkaMessageConsumer consumer) {
        this.producer = producer;
        this.consumer = consumer;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> publish(@RequestBody MessageRequest request) {
        producer.send(request.message());
        return ResponseEntity.accepted().body(Map.of("status", "queued", "message", request.message()));
    }

    @GetMapping
    public List<String> receivedMessages() {
        return consumer.getReceivedMessages();
    }
}
