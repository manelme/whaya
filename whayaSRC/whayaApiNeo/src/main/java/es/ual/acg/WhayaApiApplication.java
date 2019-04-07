package es.ual.acg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.provider.expression.OAuth2MethodSecurityExpressionHandler;
import org.springframework.security.oauth2.provider.token.RemoteTokenServices;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableTransactionManagement
@ComponentScan
@EnableNeo4jRepositories
@EnableEurekaClient
@SpringBootApplication
public class WhayaApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(WhayaApiApplication.class, args);
	}
	@Primary
	@Bean
	public RemoteTokenServices tokenService() {
	    RemoteTokenServices tokenService = new RemoteTokenServices();
	    tokenService.setCheckTokenEndpointUrl(
	      "http://zuul:8080/authservice/oauth/check_token");
	    tokenService.setClientId("ClientIdPassword");
	    tokenService.setClientSecret("secret");
	    return tokenService;
	}
	
	@Configuration
	@EnableResourceServer
	@EnableGlobalMethodSecurity(prePostEnabled = true)
	public class OAuth2ResourceServerConfig 
	  extends GlobalMethodSecurityConfiguration {
	 
	    @Override
	    protected MethodSecurityExpressionHandler createExpressionHandler() {
	        return new OAuth2MethodSecurityExpressionHandler();
	    }
	}
}
