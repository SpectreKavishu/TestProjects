package com.finance.agent;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.embedding.AllMiniLmL6V2EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.pgvector.PgVectorEmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingMatch;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class StockRagService {

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;

    // Data object for the frontend
    public static class SearchResult {
        public String companyName;
        public String ticker;
        public String description;
        public double matchScore;

        public SearchResult(String companyName, String ticker, String description, double matchScore) {
            this.companyName = companyName;
            this.ticker = ticker;
            this.description = description;
            this.matchScore = matchScore;
        }
    }

    public StockRagService() {
        this.embeddingModel = new AllMiniLmL6V2EmbeddingModel();
        this.embeddingStore = PgVectorEmbeddingStore.builder()
                .host("localhost")
                .port(5432)
                .database("finance_db")
                .user(DatabaseConfig.DB_USER)
                .password(DatabaseConfig.DB_PASSWORD)
                .table("indian_stocks")
                .dimension(384) 
                .createTable(false) 
                .build();
    }

    public void generateEmbeddingsForExistingStocks() {
        try (Connection conn = DriverManager.getConnection(DatabaseConfig.JDBC_URL, DatabaseConfig.DB_USER, DatabaseConfig.DB_PASSWORD);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT embedding_id, metadata->>'ticker' as ticker, text FROM indian_stocks WHERE embedding IS NULL")) {

            while (rs.next()) {
                String id = rs.getString("embedding_id");
                String ticker = rs.getString("ticker");
                String description = rs.getString("text");
                
                if (description != null && !description.isEmpty()) {
                    System.out.println("Generating embedding for " + ticker + "...");
                    dev.langchain4j.data.embedding.Embedding embedding = embeddingModel.embed(description).content();
                    
                    try (var updateStmt = conn.prepareStatement("UPDATE indian_stocks SET embedding = ?::vector WHERE embedding_id = ?::uuid")) {
                        updateStmt.setString(1, java.util.Arrays.toString(embedding.vector()));
                        updateStmt.setString(2, id);
                        updateStmt.executeUpdate();
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<SearchResult> searchStocks(String query, int maxResults) {
        dev.langchain4j.data.embedding.Embedding queryEmbedding = embeddingModel.embed(query).content();
        List<EmbeddingMatch<TextSegment>> matches = embeddingStore.findRelevant(queryEmbedding, maxResults);

        List<SearchResult> results = new ArrayList<>();
        for (EmbeddingMatch<TextSegment> match : matches) {
            String companyName = match.embedded().metadata().getString("company_name");
            String ticker = match.embedded().metadata().getString("ticker");
            String text = match.embedded().text();
            
            // Format score to 4 decimal places for clean UI
            double roundedScore = Math.round(match.score() * 10000.0) / 10000.0;
            results.add(new SearchResult(companyName, ticker, text, roundedScore));
        }
        return results;
    }
}
