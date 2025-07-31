package br.com.tinnova.desafio_tinnova_back;

import org.springframework.boot.SpringApplication;

public class TestDesafioTinnovaBackApplication {

	public static void main(String[] args) {
		SpringApplication.from(DesafioTinnovaBackApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
