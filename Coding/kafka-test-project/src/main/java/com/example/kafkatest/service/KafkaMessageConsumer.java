package com.example.kafkatest.service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.LinkedBlockingQueue;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaMessageConsumer {

    private final CopyOnWriteArrayList<String> receivedMessages = new CopyOnWriteArrayList<>();
    private final BlockingQueue<String> messageQueue = new LinkedBlockingQueue<>();

    @KafkaListener(topics = "${app.kafka.topic}", groupId = "${spring.kafka.consumer.group-id}")
    public void listen(String message) {
        receivedMessages.add(message);
        messageQueue.offer(message);
    }

    public List<String> getReceivedMessages() {
        return new ArrayList<>(receivedMessages);
    }

    public void reset() {
        receivedMessages.clear();
        messageQueue.clear();
    }

    public String awaitMessage(Duration timeout) throws InterruptedException {
        return messageQueue.poll(timeout.toMillis(), java.util.concurrent.TimeUnit.MILLISECONDS);
    }
}
