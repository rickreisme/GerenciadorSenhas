from flask import Blueprint, jsonify, request
from sqlalchemy import text
from .. import db
from app.models.user import User
import json

import_bp = Blueprint('import_bp', __name__)

@import_bp.route('/import/users/', methods=['POST'])
def import_user():
    data = request.get_json()
    required_fields = {"nome", "email", "password"}
    users = data['users']
    users_add = []
    users_not_added = []

    #print(users)
    if len(users) == 0:
        return jsonify({'message':'Não existe nenhum usuário na requisição.'}), 400
    else:
        for user in users:
            if required_fields.issubset(user.keys()):
                verificarUsers = db.session.execute(text(f"SELECT * FROM tb_users WHERE email = '{user['email']}'"))
                userExist = verificarUsers.fetchall()
                if len(userExist) != 0:
                    users_not_added.append(user)
                else:
                    user = User(user['nome'], user['email'], user['password'])
                    db.session.execute(text(f"INSERT INTO tb_users (username, email, password, create_at) VALUES ('{user.nome}', '{user.email}', '{user.senha}', NOW());"))
                    db.session.commit()
                    users_add.append(user.to_json())
            else:
                users_not_added.append(user)
                #missing_fields = required_fields - user.keys()
        users_added_return = {'usuarios adicionados': users_add}
        users_not_added_return = {'usuarios nao adicionados': users_not_added}
        list_return = []
        if len(users_added_return['usuarios adicionados']) >= 1:
            list_return.append(users_added_return)
        if len(users_not_added_return['usuarios nao adicionados']) >= 1:
            list_return.append(users_not_added_return)
        return jsonify({'data': list_return}), 201

@import_bp.route('/import/passwords/', methods=['POST'])
def import_passwords():
    data = request.get_json()
    required_fields = {'user_id', 'title', 'email', 'password_encripted', 'url'}
    passwords = data['passwords']
    passwords_add = []
    passwords_not_added = []

    if len(passwords) == 0:
        return jsonify({'message':'Não existe nenhuma senha na requisição.'}), 400
    else:
        for password in passwords:
            if required_fields.issubset(password.keys()):
                if password['user_id'] == None:
                    #return jsonify({'message': 'Usuário não encontrado'}), 404
                    print('Usuário não encontrado')
                if password['user_id'] < 0:
                    #return jsonify({'message': 'ID inválido'}), 400
                    print('ID inválido')
                if password['user_id'] > 0:
                    result = db.session.execute(text(f"SELECT * FROM tb_users WHERE id = {password['user_id']};"))
                    user = result.fetchall()

                    if len(user) != 1:
                        #return jsonify({'message': 'Usuário não encontrado'}), 404
                        print('Usuário não encontrado')
                    else:
                        sql = f"INSERT INTO tb_passwords (user_id, title, email, password_encrypted, url, favorito, create_at, updated_at) VALUES ( {password['user_id']}, '{password['title']}', '{password['email']}', '{password['password_encripted']}', '{password['url']}', 'N', NOW(), NOW())"
                        db.session.execute(text(sql))
                        db.session.commit()

                        passwords_add.append(password)
            else:
                passwords_not_added.append(password)
                #missing_fields = required_fields - user.keys()
        passwords_added_return = {'senhas adicionados': passwords_add}
        passwords_not_added_return = {'senhas nao adicionados': passwords_not_added}
        list_return = []
        if len(passwords_added_return['senhas adicionados']) >= 1:
            list_return.append(passwords_added_return)
        if len(passwords_not_added_return['senhas nao adicionados']) >= 1:
            list_return.append(passwords_not_added_return)
        return jsonify({'data': list_return}), 201

@import_bp.route('/import/notes/', methods=['POST'])
def import_notes():
    data = request.get_json()
    required_fields = {'user_id', 'title', 'content'}
    notes = data['notes']
    notes_add = []
    notes_not_added = []

    if len(notes) == 0:
        return jsonify({'message':'Não existe nenhuma nota na requisição.'}), 400
    else:
        for note in notes:
            if required_fields.issubset(note.keys()):
                if note['user_id'] == None:
                    #return jsonify({'message': 'Usuário não encontrado'}), 404
                    print('Usuário não encontrado')
                if note['user_id'] < 0:
                    #return jsonify({'message': 'ID inválido'}), 400
                    print('ID inválido')
                if note['user_id'] > 0:
                    result = db.session.execute(text(f"SELECT * FROM tb_users WHERE id = {note['user_id']};"))
                    user = result.fetchall()

                    if len(user) != 1:
                        #return jsonify({'message': 'Usuário não encontrado'}), 404
                        print('Usuário não encontrado')
                    else:
                        sql = f"INSERT INTO tb_notes (user_id, title, content, create_at, updated_at) VALUES ({note['user_id']}, '{note['title']}', '{note['content']}', NOW(), NOW());"
                        db.session.execute(text(sql))
                        db.session.commit()

                        notes_add.append(note)
            else:
                notes_not_added.append(note)
                #missing_fields = required_fields - user.keys()
        notes_added_return = {'notas adicionados': notes_add}
        notes_not_added_return = {'notas nao adicionados': notes_not_added}
        list_return = []
        if len(notes_added_return['notas adicionados']) >= 1:
            list_return.append(notes_added_return)
        if len(notes_not_added_return['notas nao adicionados']) >= 1:
            list_return.append(notes_not_added_return)
        return jsonify({'data': list_return}), 201