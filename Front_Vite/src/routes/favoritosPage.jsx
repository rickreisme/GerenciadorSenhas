import '../assets/styles/favoritos.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoArrowBack } from "react-icons/io5";
import { FaEyeSlash, FaEye, FaTrash } from "react-icons/fa";
import Modal from "react-modal";
import { toast } from 'react-toastify';

const FavoritosPage = () => {
    const navigate = useNavigate();
    const [favoritos, setFavoritos] = useState([]);
    const [error, setError] = useState(null);
    const [isModal5Open, setIsModal5Open] = useState(false);
    const [errorMessage4, setErrorMessage4] = useState('');
    const [currentId2, setCurrentId2] = useState(null);
    let idUsuario = document.cookie.split('=')[1];
    useEffect(() => {
        const fetchFavoritos = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/users/${idUsuario}/favorito`);
                console.log('Response data:', response.data);
                if (response.data && Array.isArray(response.data.favoritos)) {
                    setFavoritos(response.data.favoritos);
                    setError(null)
                } else {
                    setError('Resposta inesperada da API.');
                }
            } catch (error) {
                console.error('Erro ao buscar favoritos:', error);
                if (error.response && error.response.status === 404) {
                    setError('Não há favoritos para exibir!');
                } else {
                    setError('Erro ao buscar favoritos.');
                }
            }
        };

        fetchFavoritos();
    }, []);

    const handleModal5Open = (id) => {
        setCurrentId2(id);
        setIsModal5Open(true);
    };

    const handleModal5Close = () => {
        setIsModal5Open(false);
        setCurrentId2(null);
    };

    const handleDeletarFavorito = async () => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/users/${idUsuario}/favorito/${currentId2}`);

            if (response.status === 200) {
                toast.success('Favorito deletado com sucesso!');
                setFavoritos(favoritos.filter(favorito => favorito.id !== currentId2));
                handleModal5Close();
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage4('Usuário não encontrado.');
            } else {
                setErrorMessage4('Ocorreu um erro ao excluir o favorito.');
            }
        }
    };

    const toggleExibirSenha = (index) => {
        const updatedFavoritos = [...favoritos];
        updatedFavoritos[index].exibirSenha = !updatedFavoritos[index].exibirSenha;
        setFavoritos(updatedFavoritos);
    };

    return (
        <>
            <div className="favoritos-container">
                <div className="favoritos-intro">
                    <button className="btn-back" onClick={() => navigate('/dashboard')}>
                        <IoArrowBack className="icon-back" />
                    </button>
                    <h1 className="title">Favoritos</h1>
                </div>

                <div className="favoritos-senhas">
                    {error ? (
                        <p>{error}</p>
                    ) : (
                        favoritos.map((favorito, index) => (
                            <div key={index} className="senha-card">
                                <h2><span>{favorito.title}</span></h2>
                                <p><span>Email: </span>{favorito.email}</p>
                                <p><span>Site: </span>
                                    <a href={favorito.url} target='_blank' rel='noreferrer'>
                                        {favorito.url}
                                    </a>
                                </p>

                                <div className="senhaOculta">
                                    <span>Senha:</span>
                                    <p className={favorito.exibirSenha ? 'senha-visible' : 'senha-hidden'}>
                                        {favorito.password_encripted}
                                    </p>
                                    <p className={favorito.exibirSenha ? 'senha-hidden' : 'senha-visible'}>
                                        ********
                                    </p>
                                    <button className="exibir-senha" onClick={() => toggleExibirSenha(index)}>
                                        {favorito.exibirSenha ? <FaEyeSlash className="hidden-icon" /> : <FaEye className="hidden-icon" />}
                                    </button>
                                </div>

                                <div className='btns-senha-card'>
                                    <button
                                        className="btn-apagar-senha"
                                        type="button"
                                        onClick={() => handleModal5Open(favorito.id)}
                                    >
                                        <FaTrash className='icon-trash' />
                                        <p>Apagar favorito</p>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModal5Open}
                onRequestClose={handleModal5Close}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                contentLabel="Apagar favorito"
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    },
                    content: {
                        backgroundColor: "#143ca8",
                        border: "none",
                        borderRadius: "8px",
                        maxWidth: "430px",
                        margin: "auto",
                        height: "170px"
                    }
                }}
            >
                <div className="modalApagarFavorito">
                    <div className="apagarFavorito-modal-intro">
                        <div className="modal-title-intro">
                            <h2>Apagar um favorito</h2>
                        </div>

                        <p>Deseja mesmo remover essa senha dos favoritos?</p>
                    </div>

                    <div className="btns-apagar-favorito">
                        <button
                            className="btn-sim"
                            onClick={handleDeletarFavorito}
                        >
                            Sim
                        </button>
                        <button
                            className="btn-nao"
                            onClick={handleModal5Close}
                        >
                            Não
                        </button>
                        {errorMessage4 && <p className="error">{errorMessage4}</p>}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default FavoritosPage;