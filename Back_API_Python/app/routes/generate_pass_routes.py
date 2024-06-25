from flask import Blueprint, jsonify, request
import random
import string

generate_pass_bp = Blueprint('generate_pass_bp', __name__)

TAMANHO_MAXIMO_SENHA = 128

@generate_pass_bp.route('/generate-password/', methods=['POST'])
def generate_pass():
    config = request.get_json()

    if config['quantidade_letras'] > TAMANHO_MAXIMO_SENHA:
        return jsonify({'message': f'Senha com tamanho além do permitido, tamanho maximo é {TAMANHO_MAXIMO_SENHA}'}), 400
    
    letras_maiusculas = string.ascii_uppercase if config['letras_maiusculas'] else ''
    letras_minusculas = string.ascii_lowercase if config['letras_minusculas'] else ''
    numeros = string.digits if config['numeros'] else ''
    caracteres_especiais = string.punctuation if config['caracteres_especiais'] else ''

    caracteres = letras_maiusculas + letras_minusculas + numeros + caracteres_especiais

    senha = []

    numeros_adicionados = 0
    caracteres_especiais_adicionados = 0
    while numeros_adicionados < config['quantidade_minima_numeros'] or (caracteres_especiais_adicionados < config['quantidade_minima_especiais'] and config['caracteres_especiais']):
        carac_aleatorio = random.choice(caracteres)
        if (carac_aleatorio.isdigit() and numeros_adicionados < config['quantidade_minima_numeros']) or (carac_aleatorio in caracteres_especiais and caracteres_especiais_adicionados < config['quantidade_minima_especiais']):
            senha.append(carac_aleatorio)
            if carac_aleatorio.isdigit():
                numeros_adicionados += 1
            else:
                caracteres_especiais_adicionados += 1

    while len(senha) < config['quantidade_letras']:
        senha.append(random.choice(caracteres))

    random.shuffle(senha)
    senha_gerada = ''.join(senha)

    return jsonify({'senha_gerada': f'{senha_gerada}'}), 200