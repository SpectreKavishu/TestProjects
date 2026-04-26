package com.example.kafkatest;

import com.example.kafkatest.service.KafkaMessageConsumer;
import com.example.kafkatest.service.KafkaMessageProducer;
import java.time.Duration;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = "test-messages")
class KafkaMessagingIntegrationTest {

    @Autowired
    private KafkaMessageProducer producer;

    @Autowired
    private KafkaMessageConsumer consumer;

    @BeforeEach
    void setUp() {
        consumer.reset();
    }

    @DynamicPropertySource
    static void overrideKafkaProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.kafka.bootstrap-servers",
                () -> System.getProperty("spring.embedded.kafka.brokers"));
    }

    @Test
    void shouldPublishAndConsumeMessage() throws InterruptedException {
        String payload = "hello kafka";

        producer.send(payload);

        String received = consumer.awaitMessage(Duration.ofSeconds(10));
        Assertions.assertEquals(payload, received);
    }
}
