package br.com.tinnova.desafio_tinnova_back.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tinnova.desafio_tinnova_back.entity.Model;
import br.com.tinnova.desafio_tinnova_back.repository.ModelRepository;

@RestController
@CrossOrigin
@RequestMapping("/api/modelos")
public class ModelController {
    
    @Autowired
    private ModelRepository modelRepository;
    
    @GetMapping
    public List<Model> listAllModels() {
        return modelRepository.findAllByOrderByNameAsc();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Model> getModelById(@PathVariable Long id) {
        return modelRepository.findById(id)
            .map(model -> ResponseEntity.ok().body(model))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/marca/{brandId}")
    public List<Model> getModelsByBrand(@PathVariable Long brandId) {
        return modelRepository.findByBrandIdOrderByNameAsc(brandId);
    }
    
    @GetMapping("/com-marca")
    public List<Model> listModelsWithBrand() {
        return modelRepository.findAllByOrderByNameAsc();
    }
}
