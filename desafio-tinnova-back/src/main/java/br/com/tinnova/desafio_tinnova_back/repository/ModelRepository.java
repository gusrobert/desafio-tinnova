package br.com.tinnova.desafio_tinnova_back.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.tinnova.desafio_tinnova_back.entity.Model;

@Repository
public interface ModelRepository extends JpaRepository<Model, Long> {
    
    List<Model> findByBrandIdOrderByNameAsc(Long brandId);
    
    Optional<Model> findByNameAndBrandId(String name, Long brandId);
    
    List<Model> findAllByOrderByNameAsc();
    
    @Query("SELECT m FROM Model m WHERE m.brand.id = :brandId ORDER BY m.name")
    List<Model> findByBrandId(@Param("brandId") Long brandId);
    
    boolean existsByNameAndBrandId(String name, Long brandId);
    
    // Novos métodos usando relacionamentos
    List<Model> findByBrandOrderByNameAsc(br.com.tinnova.desafio_tinnova_back.entity.Brand brand);
    
    Optional<Model> findByNameAndBrand(String name, br.com.tinnova.desafio_tinnova_back.entity.Brand brand);
    
    boolean existsByNameAndBrand(String name, br.com.tinnova.desafio_tinnova_back.entity.Brand brand);
}
