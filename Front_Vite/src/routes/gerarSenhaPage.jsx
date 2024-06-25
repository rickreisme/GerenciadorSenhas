import "../assets/styles/senha.scss"
import { useNavigate } from "react-router-dom/dist";
import { useState } from "react";
import { IoArrowBack, IoClose } from "react-icons/io5";
import Modal from "react-modal";
import axios from 'axios';
import { toast } from 'react-toastify';

const SenhaPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModal2Open, setIsModal2Open] = useState(false);

    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [password_encripted, setPasswordEncripted] = useState('');
    const [url, setUrl] = useState('');

    const [qtd_letra, setQtdLetra] = useState('');
    const [letras_Mai, setLetrasMai] = useState('');
    const [letras_Min, setLetrasMin] = useState('');
    const [numeros, setNumeros] = useState('');
    const [caract_esp, setCaracEsp] = useState('');
    const [qtd_min_num, setQtdMinNum] = useState('');
    const [qtd_min_esp, setQtdMinEsp] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');

    const handleModalOpen = () => {
        setIsModalOpen(true);
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
    }

    const handleModal2Open = () => {
        setIsModal2Open(true);
    }

    const handleModal2Close = () => {
        setIsModal2Open(false);
    }

    let idUsuario = document.cookie.split('=')[1];

    const handleCriarSenha = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://127.0.0.1:8000/users/${idUsuario}/password/`, {
                'title': title,
                'email': email,
                'password_encripted': password_encripted,
                'url': url,
            });

            if (response.status === 201) {
                setIsModalOpen(false);
                toast.success('Senha criada com sucesso!');
                title('');
                email('');
                password_encripted('');
                url('');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage('Usuário não encontrado.');
            } else {
                setErrorMessage('Ocorreu um erro ao criar a senha. Tente novamente.');
            }
        }
    };

    const handleGerarSenha = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/generate-password/', {
                quantidade_letras: parseInt(qtd_letra),
                letras_maiusculas: letras_Mai,
                letras_minusculas: letras_Min,
                numeros,
                caracteres_especiais: caract_esp,
                quantidade_minima_numeros: parseInt(qtd_min_num),
                quantidade_minima_especiais: parseInt(qtd_min_esp)
            });

            if (response.status === 200) {
                const senhaGerada = response.data.senha_gerada
                await navigator.clipboard.writeText(senhaGerada)
                setIsModal2Open(false);
                toast.success('Senha gerada com sucesso e copiada para a área de transferência!');
                setQtdLetra('');
                setLetrasMai(false);
                setLetrasMin(false);
                setNumeros(false);
                setCaracEsp(false);
                setQtdMinNum('');
                setQtdMinEsp('');
            }
        } catch (error) {
            if (error.response === 400) {
                setErrorMessage2('Usuário não encontrado.');
            } else {
                setErrorMessage2('Ocorreu um erro ao gerar a senha. Tente novamente.');
            }
        }
    };

    return (
        <>
            <div className="senha-container">
                <div className="senha-intro">
                    <button className="btn-back"
                        onClick={() => navigate(-1)}
                    >
                        <IoArrowBack className="icon-back" />
                    </button>

                    <h2 className="title">Cadastrar nova senha</h2>
                </div>

                <div className="senha-content">
                    <h3>Escolha o tipo de senha que deseja cadastrar</h3>
                    <div className="senhas-btns">
                        <button
                            className="btn-senha-manual"
                            type="button"
                            onClick={handleModalOpen}
                        >
                            Criar nova senha
                        </button>

                        <button
                            className="btn-gerar-senha"
                            type="button"
                            onClick={handleModal2Open}
                        >
                            Gerar nova senha
                        </button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleModalClose}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                contentLabel="Criar senha"

                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    },
                    content: {
                        backgroundColor: "#143ca8",
                        border: "none",
                        borderRadius: "8px",
                        maxWidth: "500px",
                        margin: "auto"
                    }
                }}
            >
                <div className="modalCriarSenha">
                    <div className="criarSenha-modal-intro">
                        <div className="modal-title-intro">
                            <h2>Crie uma senha</h2>

                            <button className="modal-btn-close" onClick={handleModalClose}>
                                <IoClose className="modal-icon-close" />
                            </button>
                        </div>

                        <p>Preencha os dados para criar a senha:</p>
                    </div>

                    <div className="dados-senha">
                        <form onSubmit={handleCriarSenha}>
                            <input
                                type="text"
                                id="titulo"
                                placeholder="Título"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
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
                                value={password_encripted}
                                onChange={(e) => setPasswordEncripted(e.target.value)}
                            />
                            <input
                                type="text"
                                id="url"
                                placeholder="Url do site"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                            {errorMessage && <p className="error">{errorMessage}</p>}

                            <button
                                className="btn-criar-senha"
                                type="submit"
                            >
                                Criar senha
                            </button>
                        </form>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isModal2Open}
                onRequestClose={handleModal2Close}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                contentLabel="Gerar senha"

                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    },
                    content: {
                        backgroundColor: "#143ca8",
                        border: "none",
                        borderRadius: "8px",
                        maxWidth: "515px",
                        margin: "auto"
                    }
                }}
            >
                <div className="modalGerarSenha">
                    <div className="gerarSenha-modal-intro">
                        <div className="modal-title-intro">
                            <h2>Gerar uma senha</h2>

                            <button className="modal-btn-close" onClick={handleModal2Close}>
                                <IoClose className="modal-icon-close" />
                            </button>
                        </div>

                        <p>Preencha os dados para gerar a senha:</p>
                    </div>

                    <div className="dados-senha">
                        <form onSubmit={handleGerarSenha}>
                            <input
                                type="number"
                                id="qtd_letras"
                                placeholder="Quantidade de letras"
                                value={qtd_letra}
                                onChange={(e) => setQtdLetra(e.target.value)}
                            />
                            <label className="input_check">
                                <input
                                    type="checkbox"
                                    id="letras_Mai"
                                    checked={letras_Mai}
                                    onChange={(e) => setLetrasMai(e.target.checked)}
                                />
                                Incluir letras maíusculas
                            </label>
                            <label className="input_check">
                                <input
                                    type="checkbox"
                                    id="letras_Min"
                                    checked={letras_Min}
                                    onChange={(e) => setLetrasMin(e.target.checked)}
                                />
                                Incluir letras minúsculas
                            </label>
                            <label className="input_check">
                                <input
                                    type="checkbox"
                                    id="numeros"
                                    checked={numeros}
                                    onChange={(e) => setNumeros(e.target.checked)}
                                />
                                Incluir números
                            </label>
                            <label className="input_check">
                                <input
                                    type="checkbox"
                                    id="caract_esp"
                                    checked={caract_esp}
                                    onChange={(e) => setCaracEsp(e.target.checked)}
                                />
                                Incluir caracteres especiais
                            </label>
                            <input
                                type="number"
                                id="qtd_min_num"
                                placeholder="Quantidade de mínima de números"
                                value={qtd_min_num}
                                onChange={(e) => setQtdMinNum(e.target.value)}
                            />
                            <input
                                type="number"
                                id="qtd_min_esp"
                                placeholder="Quantidade de mínima de caracteres especiais"
                                value={qtd_min_esp}
                                onChange={(e) => setQtdMinEsp(e.target.value)}
                            />
                            {errorMessage && <p className="error">{errorMessage2}</p>}

                            <button
                                className="btn-gerar-senha"
                                type="submit"
                            >
                                Gerar senha
                            </button>
                        </form>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default SenhaPage;