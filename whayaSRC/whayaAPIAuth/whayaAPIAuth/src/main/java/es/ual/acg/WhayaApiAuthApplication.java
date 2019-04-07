package es.ual.acg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class WhayaApiAuthApplication {

	public static void main(String[] args) {
		SpringApplication.run(WhayaApiAuthApplication.class, args);
	}
	
}
