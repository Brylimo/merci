package com.thxpapa.merci;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class MerciApplication {
	public static void main(String[] args) {
		SpringApplication.run(MerciApplication.class, args);
	}
}