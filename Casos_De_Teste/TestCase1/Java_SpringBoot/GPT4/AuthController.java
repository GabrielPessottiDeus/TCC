import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {

    // Simulação de "banco de dados" em memória
    private static final Map<String, String> fakeDatabase = new HashMap<>();

    static {
        fakeDatabase.put("admin", "1234");
        fakeDatabase.put("user", "password");
    }

    // Classe para mapear o JSON recebido
    static class LoginRequest {
        public String username;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {

        String username = request.username;
        String password = request.password;

        // "Consulta" ao banco (simulada)
        if (fakeDatabase.containsKey(username)) {
            String storedPassword = fakeDatabase.get(username);

            // Validação de credenciais
            if (storedPassword.equals(password)) {
                return ResponseEntity.ok("Autenticação bem-sucedida");
            }
        }

        return ResponseEntity.status(401).body("Usuário ou senha inválidos");
    }
}