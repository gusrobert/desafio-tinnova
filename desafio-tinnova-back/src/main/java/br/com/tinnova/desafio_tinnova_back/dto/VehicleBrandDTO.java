package br.com.tinnova.desafio_tinnova_back.dto;

public class VehicleBrandDTO {
    private String id;
    private String name;

    public VehicleBrandDTO() {}

    public VehicleBrandDTO(String id, String name) {
        this.id = id;
        this.name = name;
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
}
