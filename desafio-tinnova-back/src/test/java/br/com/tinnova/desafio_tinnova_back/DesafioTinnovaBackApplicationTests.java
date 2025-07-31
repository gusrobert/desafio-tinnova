package br.com.tinnova.desafio_tinnova_back;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class DesafioTinnovaBackApplicationTests {

	@Test
	void contextLoads() {
	}

}
