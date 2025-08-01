package br.com.tinnova.desafio_tinnova_back.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.tinnova.desafio_tinnova_back.entity.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    
    Optional<Brand> findByName(String name);
    
    List<Brand> findAllByOrderByNameAsc();
    
    boolean existsByName(String name);
}
