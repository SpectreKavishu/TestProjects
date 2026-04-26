package com.finance.agent;

import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;

public class App {
    public static void main(String[] args) {
        System.out.println("Starting AI Finance Agent System...");
        
        StockRagService service = new StockRagService();
        service.generateEmbeddingsForExistingStocks(); // Seed DB if needed

        // Initialize Web Server
        Javalin app = Javalin.create(config -> {
            // Serve our aesthetic HTML/CSS/JS from src/main/resources/public
            config.staticFiles.add("/public", Location.CLASSPATH);
        }).start(7070);

        // Define our RAG backend API
        app.get("/api/search", ctx -> {
            String q = ctx.queryParam("q");
            if (q == null || q.isBlank()) {
                ctx.status(400).result("Missing query parameter 'q'");
                return;
            }
            
            // Perform vector search
            var results = service.searchStocks(q, 3);
            ctx.json(results);
        });

        System.out.println("🚀 Web Server running at: http://localhost:7070");
    }
}
