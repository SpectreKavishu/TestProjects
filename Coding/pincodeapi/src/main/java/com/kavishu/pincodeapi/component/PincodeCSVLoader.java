package com.kavishu.pincodeapi.component;

import java.io.BufferedReader;
import java.io.FileReader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.kavishu.pincodeapi.entity.PincodeLocation;
import com.kavishu.pincodeapi.repository.PincodeLocationRepository;

@Component
public class PincodeCSVLoader implements CommandLineRunner {

    @Autowired
    private PincodeLocationRepository repo;

    @Override
    public void run(String... args) throws Exception {
        try (BufferedReader br = new BufferedReader(new FileReader("src/main/resources/pincodes.csv"))) {
            String line;
            br.readLine(); // skip header
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length == 6) {
                    PincodeLocation loc = new PincodeLocation();
                    loc.setPincode(parts[0].trim());
                    loc.setArea(parts[1].trim());
                    loc.setDistrict(parts[2].trim());
                    loc.setState(parts[3].trim());
                    loc.setLatitude(Double.parseDouble(parts[4]));
                    loc.setLongitude(Double.parseDouble(parts[5]));
                    // repo.save(loc);
                }
            }
        }
    }
}