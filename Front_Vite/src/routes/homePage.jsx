import '../assets/styles/home.scss'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoClose} from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { FaEyeSlash, FaEye, FaTrash, FaPencilAlt } from "react-icons/fa";
import Modal from "react-modal";
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const [senhas, setSenhas] = useState([]);
    const [error, setError] = useState(null);
    const [isModal3Open, setIsModal3Open] = useState(false);
    const [isModal4Open, setIsModal4Open] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [password_encripted, setPasswordEncripted] = useState('');
    const [url, setUrl] = useState('');
    const [favorito, setFavorito] = useState('');

    const [errorMessage3, setErrorMessage3] = useState('');

    const handleModal3Open = (id) => {
        const senhaEditar = senhas.find(senha => senha.id === id);

        if (senhaEditar) {
            setTitle(senhaEditar.title);
            setEmail(senhaEditar.email);
            setPasswordEncripted(senhaEditar.password_encripted);
            setUrl(senhaEditar.url);
            setFavorito(senhaEditar.favorito);
            setCurrentId(id);
            setIsModal3Open(true);
        }
    };
    let idUsuario = document.cookie.split('=')[1];
    
    const handleModal3Close = () => {
        setIsModal3Open(false);
        setCurrentId(null);
        setTitle('');
        setEmail('');
        setPasswordEncripted('');
        setUrl('');
        setFavorito('');
    };

    const handleModal4Open = (id) => {
        setCurrentId(id);
        setIsModal4Open(true);
    };

    const handleModal4Close = () => {
        setIsModal4Open(false);
        setCurrentId(null);
    };

    const handleEditarSenha = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://127.0.0.1:8000/users/${idUsuario}/password/${currentId}/`, {
                'title': title,
                'email': email,
                'password_encrypted': password_encripted,
                'url': url,
                'favorito': favorito
            });

            if (response.status === 200) {

                const updatedSenhas = senhas.map(senha =>
                    senha.id === currentId ? { ...senha, ...response.data } : senha
                );
                setSenhas(updatedSenhas);

                handleModal3Close();
                window.location.reload()
                toast.success('Senha editada com sucesso!');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage3('Usuário não encontrado.');
            } else {
                setErrorMessage3('Ocorreu um erro ao editar a senha. Tente novamente.');
            }
        }
    };

    const handleDeletarSenha = async () => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/users/${idUsuario}/password/${currentId}/`);

            if (response.status === 200) {
                toast.success('Senha deletada com sucesso!');
                setSenhas(senhas.filter(senha => senha.id !== currentId));
                handleModal4Close();
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage3('Usuário não encontrado.');
            } else {
                setErrorMessage3('Ocorreu um erro ao excluir a senha. Tente novamente.');
            }
        }
    };

    const toggleExibirSenha = (index) => {
        const updatedSenhas = [...senhas];
        updatedSenhas[index].exibirSenha = !updatedSenhas[index].exibirSenha;

        setSenhas(updatedSenhas);
    };

    useEffect(() => {
        const fetchSenhas = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/users/${idUsuario}/password`);
                if (!response.data) {
                    throw new Error('Erro ao carregar as senhas');
                }

                const ordenaSenhas = response.data.password.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

                const senhasFlag = ordenaSenhas.map((senha) => ({
                    ...senha,
                    exibirSenha: false,
                }));

                setSenhas(senhasFlag);
            } catch (error) {
                if (error.response.status === 404) {
                    setError('Usuário não possui senhas cadastradas.');
                } else {
                    setError('Erro ao carregar as senhas');
                }
            }
        };

        fetchSenhas();
    }, []);

    return (
        <>
            <div className="home-container">
                <div className="home-intro">
                    <h1 className="title">Dashboard</h1>

                    <div className="btns-home-intro">
                        <button
                            className="btn-criar-senha"
                            type="button"
                            onClick={() => navigate('/criar-senha')}
                        >
                            Nova senha
                        </button>

                        <button
                            className="btn-favoritos"
                            type="button"
                            onClick={() => navigate('/favoritos')}
                        >
                            Favoritos
                        </button>

                        <button
                            className="btn-notas"
                            type="button"
                            onClick={() => navigate('/notas')}
                        >
                            Notas seguras
                        </button>

                        <button
                            className="btn-config"
                            type="button"
                            onClick={() => navigate('/configuracoes')}
                        >
                            <IoMdSettings className='icon-config'/>
                        </button>
                        
                    </div>
                </div>

                <div className="home-senhas">
                    {error ? (
                        <p>{error}</p>
                    ) : (
                        senhas.map((senha, index) => (
                            <div key={index} className="senha-card">
                                <h2><span>{senha.title}</span></h2>
                                <p><span>Email: </span>{senha.email}</p>
                                <p><span>Site: </span>
                                    <a href={senha.url} target='_blank' rel='noreferrer'>
                                        {senha.url}
                                    </a>
                                </p>

                                <div className="senhaOculta">
                                    <span>Senha:</span>
                                    <p className={senha.exibirSenha ? 'senha-visible' : 'senha-hidden'}>
                                        {senha.password_encripted}
                                    </p>
                                    <p className={senha.exibirSenha ? 'senha-hidden' : 'senha-visible'}>
                                        ********
                                    </p>
                                    <button className="exibir-senha" onClick={() => toggleExibirSenha(index)}>
                                        {senha.exibirSenha ? <FaEyeSlash className="hidden-icon" /> : <FaEye className="hidden-icon" />}
                                    </button>
                                </div>

                                <div className="btns-senha-card">
                                    <button
                                        className="btn-editar-senha"
                                        type="button"
                                        onClick={() => handleModal3Open(senha.id)}
                                    >
                                        <FaPencilAlt className='icon-edit' />
                                        Editar informações
                                    </button>

                                    <button
                                        className="btn-apagar-senha"
                                        type="button"
                                        onClick={() => handleModal4Open(senha.id)}
                                    >
                                        <FaTrash className='icon-trash' />
                                        <p>Apagar senha</p>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModal3Open}
                onRequestClose={handleModal3Close}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                contentLabel="Editar senha"
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
                <div className="modalEditarSenha">
                    <div className="editarSenha-modal-intro">
                        <div className="modal-title-intro">
                            <h2>Editar uma senha</h2>

                            <button className="modal-btn-close" onClick={handleModal3Close}>
                                <IoClose className="modal-icon-close" />
                            </button>
                        </div>

                        <p>Preencha os dados para editar a senha:</p>
                    </div>

                    <div className="dados-senha">
                        <form onSubmit={handleEditarSenha}>
                            <input
                                type="text"
                                id="titulo2"
                                placeholder="Novo título"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <input
                                type="text"
                                id="email2"
                                placeholder="Novo e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                id="senha2"
                                placeholder="Nova senha"
                                value={password_encripted}
                                onChange={(e) => setPasswordEncripted(e.target.value)}
                            />
                            <input
                                type="text"
                                id="url2"
                                placeholder="Novo url do site"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                            <input
                                type="text"
                                id="favorito"
                                placeholder="Definir como favorito? (S ou N) "
                                value={favorito}
                                onChange={(e) => setFavorito(e.target.value)}
                            />
                            {errorMessage3 && <p className="error">{errorMessage3}</p>}

                            <button
                                className="btn-editar-senha"
                                type="submit"
                            >
                                Editar senha
                            </button>
                        </form>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isModal4Open}
                onRequestClose={handleModal4Close}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                contentLabel="Apagar senha"
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    },
                    content: {
                        backgroundColor: "#143ca8",
                        border: "none",
                        borderRadius: "8px",
                        maxWidth: "400px",
                        margin: "auto",
                        height: "170px"
                    }
                }}
            >
                <div className="modalApagarSenha">
                    <div className="apagarSenha-modal-intro">
                        <div className="modal-title-intro">
                            <h2>Apagar uma senha</h2>
                        </div>

                        <p>Deseja mesmo apagar esta senha?</p>
                    </div>

                    <div className="btns-apagar-senha">
                        <button
                            className="btn-editar-senha"
                            onClick={handleDeletarSenha}
                        >
                            Sim
                        </button>
                        <button
                            className="btn-apagar-senha"
                            onClick={handleModal4Close}
                        >
                            Não
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default HomePage;
