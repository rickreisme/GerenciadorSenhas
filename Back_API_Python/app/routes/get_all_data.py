from flask import Blueprint, jsonify, request
from sqlalchemy import text
from .. import db

get_all_data_bp = Blueprint('get_all_data_bp', __name__)

@get_all_data_bp.route('/app/data/', methods=['GET'])
def get_all_data():
    sql_tb_users = text('SELECT * FROM tb_users;')
    sql_tb_passwords = text('SELECT * FROM tb_passwords;')
    sql_tb_notes = text('SELECT * FROM tb_notes;')

    users_result = db.session.execute(sql_tb_users)
    users_result = users_result.fetchall()

    passwords_result = db.session.execute(sql_tb_passwords)
    passwords_result = passwords_result.fetchall()
    
    notes_result = db.session.execute(sql_tb_notes)
    notes_result = notes_result.fetchall()

    users_formated = []
    for user in users_result:
        users_formated.append({
            'id': user[0],
            'nome': user[1],
            'email': user[2],
            'senha': user[3],
            'create_at': user[4]
        })
    
    passwords_formated = []
    for password in passwords_result:
        passwords_formated.append({
            'id': password[0], 
            'user_id': password[1], 
            'title': password[2], 
            'password_encrypted': password[3], 
            'url': password[4], 
            'create_at': password[5], 
            'updated_at': password[6], 
            'email': password[7], 
            'favorito': password[8]
        })

    notes_formated = []
    for note in notes_result:
        notes_formated.append({
            'id': note[0], 
            'user_id': note[1], 
            'title': note[2], 
            'content': note[3],
            'create_at': note[4], 
            'updated_at': note[5]
        })

    user_return = {'tb_users': users_formated}
    passwords_return = {'tb_passwords': passwords_formated}
    notes_return = {'tb_notes': notes_formated}

    dict_return = [user_return, passwords_return, notes_return]

    return jsonify({'data': dict_return}), 200