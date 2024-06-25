import "../assets/styles/resenha.scss"
import { useNavigate } from "react-router-dom/dist";

const ResetSenhaPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="resenha-container">

                <div className="content">
                    <h2>Esqueceu a sua senha?</h2>
                    <h3 className="insira-email">
                        Por favor, insira o seu e-mail abaixo e nós iremos
                        enviar o passo a passo para recuperar a sua conta.
                    </h3>

                    <div className="resenha-area">
                        <form action="">
                            <input type="text" id="email" placeholder="E-mail" />

                            <div className="resenha-btn">
                                <button className="btn-resenha"
                                >
                                    Enviar
                                </button>
                            </div>
                        </form>
                        <button className="btn-back-login"
                            onClick={() => navigate("/")}
                        >
                            Voltar para o login
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetSenhaPage;