package com.thxpapa.merci;


import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class MerciApplication extends SpringBootServletInitializer {
	static String APPLICATION_DEV = "spring.config.location=classpath:/application-dev.properties";

	public static void main(String[] args) {
		new SpringApplicationBuilder(MerciApplication.class).properties(APPLICATION_DEV).run(args);
		// new SpringApplicationBuilder(MerciApplication.class).run(args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(MerciApplication.class);
	}

}