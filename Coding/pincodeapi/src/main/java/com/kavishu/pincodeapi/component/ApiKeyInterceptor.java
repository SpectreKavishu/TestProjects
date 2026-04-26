package com.kavishu.pincodeapi.component;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class ApiKeyInterceptor implements HandlerInterceptor {

    private String VALID_API_KEY = "testing";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        String apiKey = request.getHeader("X-API-KEY");
        if (!VALID_API_KEY.equals(apiKey)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid API Key");
            return false;
        }
        return true;
    }
}
