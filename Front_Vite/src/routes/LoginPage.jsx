import "../assets/styles/login.scss"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom/dist";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/login/', {
                "email": email,
                "senha": senha
            });
            
            if (response.data.message == "sucess") {
                let idUsuario = response.data.idUsuario;
                document.cookie = `idUsuario=${idUsuario}`;
                //console.log(idUsuario);
                navigate(`/dashboard/`);
            } else {
                setError("Email ou senha incorretos.");
            }
        } catch (error) {
            setError("Ocorreu um erro. Por favor, tente novamente.");
        }
    };

    return (
        <>
            <div className="login-container">
                <div className="content">
                    <h2>Seja bem-vindo(a) ao gerenciador de senhas!</h2>
                    <h3>Faça login para continuar</h3>

                    <div className="login-area">
                        <form onSubmit={handleLogin}>
                            <input
                                type="text"
                                id="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                id="senha"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />

                            <button
                                className="btn-call-resenha"
                                type="button"
                                onClick={() => navigate("/reset-senha")}
                            >
                                <p className="esqueceu-senha">Esqueceu a senha?</p>
                            </button>

                            <p className="sem-conta">
                                Ainda não tem uma conta?
                                <button
                                    className="btn-call-cadastro"
                                    type="button"
                                    onClick={() => navigate("/cadastro")}
                                >
                                    <span>Cadastre-se</span>
                                </button>
                            </p>

                            <div className="login-btn">
                                <button className="btn-login" type="submit">
                                    Entrar
                                </button>
                            </div>
                            {error && <p className="error-message">{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;