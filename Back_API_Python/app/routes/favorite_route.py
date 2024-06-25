from flask import Blueprint, jsonify, request
from sqlalchemy import text
from .. import db

favorite_bp = Blueprint('favorite_bp', __name__)

@favorite_bp.route('/users/<int:user_id>/favorito/', methods=['GET'])
def favorite(user_id):
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
                favorites = db.session.execute(text(f"SELECT * FROM tb_passwords WHERE user_id = {user_id} AND favorito = 'S';"))
                favorites = favorites.fetchall()
                
                if len(favorites) < 1:
                    return jsonify({'message': 'Nenhum favorito foi encontrado para o usuário informado.'}), 404
                else:
                    favorites_formated = []
                    for favorite in favorites:
                        favorites_formated.append({
                            'id': favorite[0],
                            'title': favorite[2],
                            'email': favorite[3],
                            'password_encripted': favorite[4],
                            'url': favorite[5],
                            'create_at': favorite[6],
                            'updated_at': favorite[7]
                        })
                    return jsonify({'favoritos': favorites_formated}), 200

@favorite_bp.route('/users/<int:user_id>/favorito/<int:favorite_id>', methods=['GET','POST','DELETE'])
def favorite_id(user_id, favorite_id):
    if user_id == None:
        return jsonify({'message': 'Usuário não encontrado'}), 404
    if user_id < 0:
        return jsonify({'message': 'ID de usuário inválido'}), 400
    if favorite_id == None:
        return jsonify({'message': 'Senha não encontrada'}), 404
    if favorite_id < 0:
        return jsonify({'message': 'ID de senha inválido'}), 400
    if user_id > 0 and favorite_id > 0:
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
            elif request.method == 'POST':
                password = [password for password in passwords if password[0] == favorite_id][0]
                
                password = {
                    'title': password[2],
                    'email': password[3],
                    'password_encripted': password[4],
                    'url': password[5],
                    'favorito': password[8],
                    'create_at': password[6],
                    'updated_at': password[7]
                }

                if password['favorito'] == 'S':
                    return jsonify({'message':'O item informado já é um favorito.'}), 208
                else:
                    sql = f"UPDATE tb_passwords SET favorito = 'S' WHERE id = {favorite_id}"
                    db.session.execute(text(sql))
                    db.session.commit()

                    return jsonify({'message':'O item foi adicionado aos favoritos.'}), 201
            else:
                password = [password for password in passwords if password[0] == favorite_id][0]
                
                password = {
                    'title': password[2],
                    'email': password[3],
                    'password_encripted': password[4],
                    'url': password[5],
                    'favorito': password[8],
                    'create_at': password[6],
                    'updated_at': password[7]
                }

                if password['favorito'] != 'S':
                    return jsonify({'message':'O item informado não é um favorito.'}), 400
                else:
                    sql = f"UPDATE tb_passwords SET favorito = 'N' WHERE id = {favorite_id}"
                    db.session.execute(text(sql))
                    db.session.commit()

                    return jsonify({'message':'O item foi deletado dos favoritos.'}), 200