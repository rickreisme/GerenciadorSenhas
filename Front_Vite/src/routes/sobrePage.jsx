import '../assets/styles/sobre.scss';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";

const SobrePage = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="sobre-container">
                <div className="sobre-intro">
                    <button className="btn-back" onClick={() => navigate('/configuracoes')}>
                        <IoArrowBack className="icon-back" />
                    </button>
                    <h1 className="title">Sobre o Gerenciador de Senhas</h1>
                </div>

                <div className="sobre">
                    <div className="sobre-projeto">
                        <strong><h1>Sobre o Projeto</h1></strong>

                        <p>
                            O Gerenciador de Senhas é uma solução desenvolvida
                            para armazenar e gerenciar suas senhas de forma segura e
                            eficiente em uma interface simples e intuitiva.
                        </p>
                    </div>

                    <div className="sobre-tec">
                        <strong><h1>Tecnologias Utilizadas</h1></strong>
                        <h3>
                            Nosso projeto utiliza tecnologias de ponta para garantir a
                            melhor experiência e segurança:
                        </h3>

                        <p>
                            <strong>Back-End:</strong> Desenvolvido em Python, garantindo uma base sólida
                            e segura.
                        </p>

                        <p>
                            <strong>Front-End:</strong> Construído com Vite e React, proporcionando uma interface
                            rápida e responsiva.
                        </p>
                    </div>

                    <div className="sobre-equipe">
                        <strong><h1>Nossa Equipe</h1></strong>

                        <p>
                            Camila Frazão, João Henrique, Júlio Cesar, Rickson Reis
                            e Vitor Hayaxibara
                        </p>
                    </div>

                    <div className="sobre-thanks">
                        <strong><h1>Obrigado!</h1></strong>

                        <p>
                            Comece a usar o Gerenciador de Senhas e descubra como é simples e
                            seguro gerenciar suas senhas em um só lugar. Acesse nossa plataforma
                            e tenha a tranquilidade de que suas informações estão seguras com
                            &quot;Os Melhores da Fatec&quot;.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SobrePage;