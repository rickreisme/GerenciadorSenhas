import '../assets/styles/notas.scss'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoClose, IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import Modal from "react-modal";
import { toast } from 'react-toastify';

const NotasPage = () => {
    const navigate = useNavigate();
    const [notas, setNotas] = useState([]);
    const [error, setError] = useState(null);
    const [isModal6Open, setIsModal6Open] = useState(false);
    const [isModal7Open, setIsModal7Open] = useState(false);
    const [currentId3, setCurrentId3] = useState(null);

    const [title, setTitle] = useState('');
    const [conteudo, setConteudo] = useState('');

    const [errorMessage5, setErrorMessage5] = useState('');

    const handleModal6Open = () => {
        setIsModal6Open(true);
    };

    const handleModal6Close = () => {
        setIsModal6Open(false);
        setCurrentId3(null);
        setTitle('');
        setConteudo('');
        setErrorMessage5('');
    };

    const handleModal7Open = (id) => {
        setCurrentId3(id);
        setIsModal7Open(true);
    };

    const handleModal7Close = () => {
        setIsModal7Open(false);
        setCurrentId3(null);
    };
    let idUsuario = document.cookie.split('=')[1];

    const handleCriarNota = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://127.0.0.1:8000/users/${idUsuario}/note/`, {
                'title': title,
                'content': conteudo
            });

            if (response.status === 201) {
                const novaNota = response.data;
                setNotas([...notas, novaNota]);

                handleModal6Close();
                window.location.reload()
                toast.success('Nota criada com sucesso!');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage5('Erro ao criar nota.');
            } else {
                setErrorMessage5('Ocorreu um erro ao criar a nota. Tente novamente.');
            }
        }
    };

    const handleDeletarNota = async () => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/users/${idUsuario}/note/${currentId3}/`);

            if (response.status === 200) {
                toast.success('Nota deletada com sucesso!');
                setNotas(notas.filter(nota => nota.id !== currentId3));
                handleModal7Close();
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage5('Usuário não encontrado.');
            } else {
                setErrorMessage5('Ocorreu um erro ao excluir a senha. Tente novamente.');
            }
        }
    };

    useEffect(() => {
        const fetchFavoritos = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/users/${idUsuario}/note/`);
                console.log('Response data:', response.data);
                if (response.data && Array.isArray(response.data.notas)) {
                    setNotas(response.data.notas);
                    setError(null)
                } else {
                    setError('Resposta inesperada da API.');
                }
            } catch (error) {
                console.error('Erro ao buscar favoritos:', error);
                if (error.response && error.response.status === 404) {
                    setError('Não há notas para exibir!');
                } else {
                    setError('Erro ao buscar notas.');
                }
            }
        };

        fetchFavoritos();
    }, []);

    return (
        <>
            <div className="notas-container">
                <div className="notas-intro">
                    <button className="btn-back" onClick={() => navigate('/dashboard')}>
                        <IoArrowBack className="icon-back" />
                    </button>
                    <h1 className="title">Notas Seguras</h1>
                </div>

                <div className="criar-nota">
                    <button
                        className="btn-criar-nova-nota"
                        type="button"
                        onClick={handleModal6Open}
                    >
                        <FaPencilAlt className='icon-edit' />
                        Criar nova nota
                    </button>
                </div>

                <div className="home-notas">
                    {error ? (
                        <p>{error}</p>
                    ) : (
                        notas.map((nota, index) => (
                            <div key={index} className="nota-card">
                                <h2>{nota.title}</h2>
                                <p>{nota.conteudo}</p>

                                <div className="btns-senha-card">
                                    <button
                                        className="btn-apagar-nota"
                                        type="button"
                                        onClick={() => handleModal7Open(nota.id)}
                                    >
                                        <FaTrash className='icon-trash' />
                                        <p>Apagar nota</p>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModal6Open}
                onRequestClose={handleModal6Close}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                contentLabel="Criar nota"
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    },
                    content: {
                        backgroundColor: "#143ca8",
                        border: "none",
                        borderRadius: "8px",
                        maxWidth: "450px",
                        margin: "auto",
                        height: "375px"
                    }
                }}
            >
                <div className="modalCriarNota">
                    <div className="criarNota-modal-intro">
                        <div className="modal-title-intro">
                            <h2>Criar uma nota</h2>

                            <button className="modal-btn-close" onClick={handleModal6Close}>
                                <IoClose className="modal-icon-close" />
                            </button>
                        </div>

                        <p>Preencha os dados para criar a nota:</p>
                    </div>

                    <div className="dados-nota">
                        <form onSubmit={handleCriarNota}>
                            <input
                                type="text"
                                id="titulo3"
                                placeholder="Título"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <textarea
                                type="text"
                                id="content"
                                placeholder="Conteúdo"
                                value={conteudo}
                                onChange={(e) => setConteudo(e.target.value)}
                                style={{ resize: "none" }}
                            />
                            {errorMessage5 && <p className="error">{errorMessage5}</p>}

                            <button
                                className="btn-criar-nota"
                                type="submit"
                            >
                                Criar nota
                            </button>
                        </form>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isModal7Open}
                onRequestClose={handleModal7Close}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                contentLabel="Apagar nota"
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
                <div className="modalApagarNota">
                    <div className="apagarNota-modal-intro">
                        <div className="modal-title-intro">
                            <h2>Apagar uma nota</h2>
                        </div>

                        <p>Deseja mesmo apagar esta nota?</p>
                    </div>

                    <div className="btns-apagar-nota">
                        <button
                            className="btn-sim"
                            onClick={handleDeletarNota}
                        >
                            Sim
                        </button>
                        <button
                            className="btn-nao"
                            onClick={handleModal7Close}
                        >
                            Não
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default NotasPage;