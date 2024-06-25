class User():
    def __init__(self, nome, email, senha):
        self.nome = nome
        self.email = email
        self.senha = senha
    
    def to_json(self):
        return {
            'nome': self.nome,
            'email': self.email,
        }