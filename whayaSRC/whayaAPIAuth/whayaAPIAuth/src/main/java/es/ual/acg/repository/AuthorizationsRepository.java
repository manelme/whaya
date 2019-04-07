package es.ual.acg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import es.ual.acg.domain.Authorizations;


@Component
public interface AuthorizationsRepository extends JpaRepository<Authorizations, Long>{

	Authorizations findByUsername(String username);
}
