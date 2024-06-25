from app.models.user import User
from flask import Blueprint, jsonify, request
from sqlalchemy import text
from .. import db

password_bp = Blueprint('password_bp', __name__)

@password_bp.route('/users/<int:user_id>/password/', methods=['GET', 'POST'])
def password(user_id):
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
                passwords = db.session.execute(text(f"SELECT * FROM tb_passwords WHERE user_id = {user_id};"))
                passwords = passwords.fetchall()
                
                if len(passwords) < 1:
                    return jsonify({'message': 'Nenhuma senha foi encontrada para o usuário informado.'}), 404
                else:
                    passwords_formated = []
                    for password in passwords:
                        passwords_formated.append({
                            'id': password[0],
                            'title': password[2],
                            'email': password[3],
                            'password_encripted': password[4],
                            'url': password[5],
                            'favorito': password[8],
                            'create_at': password[6],
                            'updated_at': password[7]
                        })
                    return jsonify({'password': passwords_formated}), 200
            else:
                if request.get_json() == None:
                    return jsonify({'message': 'Nenhuma senha foi informada.'}), 400
                else:
                    data = request.get_json()
                    sql = f"INSERT INTO tb_passwords (user_id, title, email, password_encrypted, url, favorito, create_at, updated_at) VALUES ( {user_id}, '{data['title']}', '{data['email']}', '{data['password_encripted']}', '{data['url']}', 'N', NOW(), NOW())"
                    
                    db.session.execute(text(sql))
                    db.session.commit()

                    return jsonify({'message': 'Senha adicionada com sucesso'}), 201

@password_bp.route('/users/<int:user_id>/password/<int:password_id>/', methods=['GET', 'POST', 'DELETE'])
def password_id(user_id, password_id):
    if user_id == None:
        return jsonify({'message': 'Usuário não encontrado'}), 404
    if user_id < 0:
        return jsonify({'message': 'ID de usuário inválido'}), 400
    if password_id == None:
        return jsonify({'message': 'Senha não encontrada'}), 404
    if password_id < 0:
        return jsonify({'message': 'ID de senha inválido'}), 400
    if user_id > 0 and password_id > 0:
        result = db.session.execute(text(f"SELECT * FROM tb_users WHERE id = {user_id};"))
        user = result.fetchall()

        if len(user) != 1:
            return jsonify({'message': 'Usuário não encontrado'}), 404
        else:
            passwords = db.session.execute(text(f"SELECT * FROM tb_passwords WHERE user_id = {user_id};"))
            passwords = passwords.fetchall()
            
            if len(passwords) < 1:
                return jsonify({'message': 'Nenhuma senha foi encontrada para o usuário informado.'}), 404
            if request.method == 'GET':
                
                if passwords == []:
                    return jsonify({'message': 'Nenhuma senha foi encontrada para o usuário informado.'}), 404
                else:
                    password = [password for password in passwords if password[0] == password_id][0]
                    
                    password = {
                        'title': password[2],
                        'email': password[3],
                        'password_encripted': password[4],
                        'url': password[5],
                        'favorito': password[8],
                        'create_at': password[6],
                        'updated_at': password[7]
                    }

                    if password == []:
                        return jsonify({'message': f'Nenhuma senha com esse id {password_id} foi encontrada para o usuário informado.'}), 404
                    else:
                        return jsonify(password)
            elif request.method == 'POST':
                if passwords == []:
                    return jsonify({'message': 'Nenhuma senha foi encontrada para o usuário informado.'}), 404
                else:
                    password = [password for password in passwords if password[0] == password_id][0]

                    if password == []:
                        return jsonify({'message': f'Nenhuma senha com esse id {password_id} foi encontrada para o usuário informado.'}), 404
                    else:
                        if request.get_json() == None:
                            return jsonify({'message': 'Nenhuma senha foi informada.'}), 400
                        else:
                            data = request.get_json()
                            print(data)
                            sql = f"UPDATE tb_passwords SET title = '{data['title']}', email = '{data['email']}', password_encrypted = '{data['password_encrypted']}', url = '{data['url']}', updated_at = NOW(), favorito = '{data['favorito']}' WHERE id = {password_id};"
                            
                            db.session.execute(text(sql))
                            db.session.commit()

                            return jsonify({'message': 'Atualização feita com sucesso.'}), 200
            else:
                password = db.session.execute(text(f"SELECT * FROM tb_passwords WHERE id = {password_id}"))
                password = password.fetchall()

                if len(password) < 1:
                    return jsonify({'message': f'Nenhuma senha com o id {password_id} foi encontrada para o usuário informado.'}), 404

                sql = f"DELETE FROM tb_passwords WHERE id = {password_id};"
                db.session.execute(text(sql))
                db.session.commit()
                
                return jsonify({'message':'Item deletado com sucesso.'}), 200