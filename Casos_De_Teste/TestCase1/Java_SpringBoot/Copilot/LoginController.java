import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
public class LoginController {

    // Simulação de banco de dados em memória
    private List<User> users = Arrays.asList(
        new User("admin", "password123"),
        new User("user", "pass")
    );

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        // Query simulada: verificar se existe usuário com username e password
        for (User user : users) {
            if (user.getUsername().equals(request.getUsername()) &&
                user.getPassword().equals(request.getPassword())) {
                // Autenticação bem-sucedida
                return ResponseEntity.ok("Login successful");
            }
        }
        // Se chegou aqui, credenciais inválidas, mas conforme pedido, apenas sucesso é tratado
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    // Classe para representar um usuário
    static class User {
        private String username;
        private String password;

        public User(String username, String password) {
            this.username = username;
            this.password = password;
        }

        public String getUsername() {
            return username;
        }

        public String getPassword() {
            return password;
        }
    }

    // Classe para o request JSON
    static class LoginRequest {
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
}