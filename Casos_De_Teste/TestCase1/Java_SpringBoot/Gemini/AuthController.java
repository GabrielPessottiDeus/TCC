import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    // Injeção do JdbcTemplate para conexão e consultas diretas ao banco de dados
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(@RequestBody LoginRequest loginRequest) {
        
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        // Montagem da query (seletor) para verificar a existência da combinação na base
        // NOTA: Em um ambiente de produção real, a senha nunca deve ser comparada em texto puro.
        // O ideal é buscar apenas pelo 'username' e validar o hash da senha via código (ex: BCrypt).
        String sqlQuery = "SELECT COUNT(*) FROM usuarios WHERE username = ? AND password = ?";

        try {
            // Executa a query passando os parâmetros recebidos no body do JSON
            Integer matchCount = jdbcTemplate.queryForObject(sqlQuery, Integer.class, username, password);

            // Valida o retorno do banco de dados
            if (matchCount != null && matchCount > 0) {
                // Encerra a função retornando o sucesso da autenticação (HTTP 200 OK)
                return ResponseEntity.ok("Autenticação realizada com sucesso.");
            } else {
                // Caso não encontre a combinação, retorna HTTP 401 (Unauthorized)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas.");
            }
            
        } catch (Exception e) {
            // Falha na conexão ou na execução da query
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno no servidor.");
        }
    }
}

// DTO (Data Transfer Object) para mapear os atributos genéricos do JSON recebido
class LoginRequest {
    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}