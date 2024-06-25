from app.models.user import User
from flask import Blueprint, jsonify, request
from sqlalchemy import text
from .. import db

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users/', methods=['GET', 'POST'])
def users():
    print(request.method)
    if request.method == 'GET':
        return "", 200
    else:
        data = request.get_json()
        verificarUsers = db.session.execute(text(f"SELECT * FROM tb_users WHERE email = '{data['email']}'"))
        userExist = verificarUsers.fetchall()
        if len(userExist) != 0:
            return jsonify({'message': 'Já existe um usuario com esse e-mail.'}), 208
        else:
            user = User(data['nome'], data['email'], data['password'])
            db.session.execute(text(f"INSERT INTO tb_users (username, email, password, create_at) VALUES ('{user.nome}', '{user.email}', '{user.senha}', NOW());"))
            db.session.commit()
            return user.to_json(), 201

@user_bp.route('/users/<int:user_id>', methods=['GET', 'POST'])
def get_users(user_id):
    if user_id == None:
        return jsonify({'message': 'Usuário não encontrado'}), 404
    if user_id < 0:
        return jsonify({'message': 'ID inválido'}), 400
    if user_id > 0:
        result = db.session.execute(text(f"SELECT * FROM tb_users WHERE id = {user_id};"))
        user = result.fetchall()

        if len(user) != 1:
            return jsonify({'message': 'Usuário não encontrado'}), 404
        else:
            if request.method == 'GET':
                user = User(user[0][1], user[0][2], user[0][4])
                return jsonify(user.to_json()), 200
            else:
                data = request.get_json()
                user = User(data['nome'], data['email'], data['password'])
                sql = f"UPDATE tb_users SET username = '{user.nome}', email = '{user.email}', PASSWORD = '{user.senha}' WHERE id = {user_id};"
                db.session.execute(text(sql))
                db.session.commit()
                return jsonify({'message': 'Usuário atualizado com sucesso'}), 200