import "../assets/styles/footer.scss"
const currentYear = new Date().getFullYear();

const Footer = () => {
    return (
        <>
            <div className="footer-container">
                <span>
                    {currentYear} | Gerenciador de Senhas - Os Melhores da Fatec
                </span>
            </div>
        </>
    )
}

export default Footer