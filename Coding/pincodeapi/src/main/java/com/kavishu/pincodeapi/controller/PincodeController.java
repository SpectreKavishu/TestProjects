package com.kavishu.pincodeapi.controller;

import com.kavishu.pincodeapi.repository.PincodeLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class PincodeController {

    @Autowired
    private PincodeLocationRepository repository;

    @GetMapping("/location")
    public ResponseEntity<?> getLocation(@RequestParam String pincode) {
        return repository.findByPincode(pincode)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("message", "Pincode not found")));
    }
}