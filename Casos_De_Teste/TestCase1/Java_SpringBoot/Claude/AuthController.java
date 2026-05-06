import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.Map;

@RestController
public class AuthController {

    private static final String DB_URL = "jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1";

    static {
        try (Connection conn = DriverManager.getConnection(DB_URL, "sa", "")) {
            Statement stmt = conn.createStatement();

            stmt.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id       INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(100) NOT NULL UNIQUE,
                    password VARCHAR(100) NOT NULL
                )
            """);

            stmt.execute("""
                MERGE INTO users (username, password)
                KEY(username)
                VALUES ('admin', 'admin123')
            """);

        } catch (SQLException e) {
            throw new RuntimeException("Falha ao inicializar banco em memória", e);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) {

        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("message", "Campos 'username' e 'password' são obrigatórios."));
        }

        String sql = "SELECT COUNT(*) FROM users WHERE username = ? AND password = ?";

        try (
            Connection conn = DriverManager.getConnection(DB_URL, "sa", "");
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            pstmt.setString(1, username);
            pstmt.setString(2, password);

            ResultSet rs = pstmt.executeQuery();

            if (rs.next() && rs.getInt(1) > 0) {
                return ResponseEntity
                    .ok(Map.of("message", "Autenticação realizada com sucesso."));
            }

            return ResponseEntity
                .status(401)
                .body(Map.of("message", "Credenciais inválidas."));

        } catch (SQLException e) {
            return ResponseEntity
                .internalServerError()
                .body(Map.of("message", "Erro interno ao processar autenticação."));
        }
    }
}