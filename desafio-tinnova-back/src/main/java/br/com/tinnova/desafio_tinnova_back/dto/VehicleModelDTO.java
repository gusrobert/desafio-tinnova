package br.com.tinnova.desafio_tinnova_back.dto;

public class VehicleModelDTO {
    private String id;
    private String name;
    private String brandId;

    public VehicleModelDTO() {}

    public VehicleModelDTO(String id, String name, String brandId) {
        this.id = id;
        this.name = name;
        this.brandId = brandId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrandId() {
        return brandId;
    }

    public void setBrandId(String brandId) {
        this.brandId = brandId;
    }
}
