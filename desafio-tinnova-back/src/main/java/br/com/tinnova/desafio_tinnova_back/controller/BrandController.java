package br.com.tinnova.desafio_tinnova_back.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tinnova.desafio_tinnova_back.entity.Brand;
import br.com.tinnova.desafio_tinnova_back.repository.BrandRepository;

@RestController
@CrossOrigin
@RequestMapping("/api/marcas")
public class BrandController {
    
    @Autowired
    private BrandRepository brandRepository;
    
    @GetMapping
    public List<Brand> listAllBrands() {
        return brandRepository.findAllByOrderByNameAsc();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable Long id) {
        return brandRepository.findById(id)
            .map(brand -> ResponseEntity.ok().body(brand))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/com-modelos")
    public List<Brand> listBrandsWithModels() {
        return brandRepository.findAllByOrderByNameAsc();
    }
}
