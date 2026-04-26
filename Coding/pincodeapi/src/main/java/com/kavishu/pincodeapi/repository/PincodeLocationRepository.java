package com.kavishu.pincodeapi.repository;

import com.kavishu.pincodeapi.entity.PincodeLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PincodeLocationRepository extends JpaRepository<PincodeLocation, Long> {
    Optional<PincodeLocation> findByPincode(String pincode);
}