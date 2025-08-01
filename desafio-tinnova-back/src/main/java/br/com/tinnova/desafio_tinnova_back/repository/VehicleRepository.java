package br.com.tinnova.desafio_tinnova_back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.tinnova.desafio_tinnova_back.entity.Vehicle;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @Query("SELECT v FROM Vehicle v JOIN FETCH v.brand JOIN FETCH v.model")
    List<Vehicle> findAllWithBrandAndModel();

}
