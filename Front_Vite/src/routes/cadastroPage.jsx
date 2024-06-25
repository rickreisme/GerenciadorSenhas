import "../assets/styles/cadastro.scss"
import { useNavigate } from "react-router-dom/dist";
import { useState } from "react";
import axios from 'axios';

const CadastroPage = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    let idUsuario = document.cookie.split('=')[1];
    console.log("idUsuario", idUsuario);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let password = senha;
            
            //console.table('nome', nome, 'email', email, 'password', password);
            const response = await axios.post('http://127.0.0.1:8000/users/', {
                'nome': nome,
                'email': email,
                'password': password
            });

            if (response.status === 201) {
                navigate("/");
            }
        } catch (error) {
            if (error.response && error.response.status === 208) {
                setErrorMessage('Já existe um usuário com esse e-mail.');
            } else {
                setErrorMessage('Ocorreu um erro ao criar a conta. Tente novamente.');
            }
        }
    };

    return (
        <>
            <div className="cadastro-container">
                <h3>Crie uma conta para continuar</h3>
                <div className="cadastro-area">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="nome"
                            placeholder="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
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
                        {errorMessage && <p className="error">{errorMessage}</p>}

                        <p>Já tem uma conta?
                            <button className="btn-call-cadastro"
                                onClick={() => navigate("/")}
                                type="button"
                            >
                                <span>Faça login</span>
                            </button>
                        </p>

                        <button
                            className="btn-login"
                            type="submit"
                        >
                            Criar conta
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CadastroPage
