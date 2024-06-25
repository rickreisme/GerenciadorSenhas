import '../assets/styles/config.scss';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack,IoAccessibilitySharp } from "react-icons/io5";
import { IoMdBrush } from "react-icons/io";
import { MdOutlineSecurity } from "react-icons/md";
import { FaInfoCircle, FaDatabase } from "react-icons/fa";
import { toast } from 'react-toastify';

const ConfigPage = () => {
    const navigate = useNavigate();

    const saveClick = () => {
        toast.success("Configurações salvas com sucesso!")
    }

    return (
        <>
            <div className="config-container">
                <div className="config-intro">
                    <button className="btn-back" onClick={() => navigate('/dashboard')}>
                        <IoArrowBack className="icon-back" />
                    </button>
                    <h1 className="title">Configurações</h1>
                </div>

                <div className="config-opcoes">
                    <button
                        className="config-opcao config-segur"
                    >
                        <MdOutlineSecurity className='config-icons'/>
                        Segurança
                    </button>

                    <button
                        className="config-opcao config-perso"
                    >
                        <IoMdBrush className='config-icons'/>
                        Personalização
                    </button>

                    <button
                        className="config-opcao config-acess"
                    >
                        <IoAccessibilitySharp className='config-icons'/>
                        Acessibilidade
                    </button>

                    <button
                        className="config-opcao config-data"
                    >
                        <FaDatabase className='config-icons'/>
                        Exportar dados
                    </button>

                    <button
                        className="config-opcao config-sobre"
                        onClick={() => navigate('/configuracoes/sobre')}
                    >
                        <FaInfoCircle className='config-icons'/>
                        Sobre
                    </button>
                </div>

                <div className="config-save">
                    <button
                        className="save-config"
                        onClick={saveClick}
                    >
                        Salvar configurações
                    </button>
                </div>
            </div>
        </>
    );
};

export default ConfigPage;