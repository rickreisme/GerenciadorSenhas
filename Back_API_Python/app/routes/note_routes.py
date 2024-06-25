from flask import Blueprint, jsonify, request
from sqlalchemy import text
from .. import db

note_bp = Blueprint('note_bp', __name__)

@note_bp.route('/users/<int:user_id>/note/', methods=['GET','POST'])
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
                notes = db.session.execute(text(f"SELECT * FROM tb_notes WHERE user_id = {user_id};"))
                notes = notes.fetchall()
                
                if len(notes) < 1:
                    return jsonify({'message': 'Nenhuma nota foi encontrada para o usuário informado.'}), 404
                else:
                    notes_formated = []
                    for note in notes:
                        notes_formated.append({
                            'id': note[0],
                            'title': note[2],
                            'conteudo': note[3],
                            'create_at': note[4],
                            'updated_at': note[5]
                        })
                    return jsonify({'notas': notes_formated}), 200
            else:
                if request.get_json() == None:
                    return jsonify({'message': 'Nenhuma senha foi informada.'}), 400
                else:
                    data = request.get_json()
                    sql = f"INSERT INTO tb_notes (user_id, title, content, create_at, updated_at) VALUES ({user_id}, '{data['title']}', '{data['content']}', NOW(), NOW());"

                    db.session.execute(text(sql))
                    db.session.commit()

                    return jsonify({'message': 'Nota inserida com sucesso.'}), 201

@note_bp.route('/users/<int:user_id>/note/<int:note_id>/', methods=['GET', 'POST', 'DELETE'])
def password_id(user_id, note_id):
    if user_id == None:
        return jsonify({'message': 'Usuário não encontrado'}), 404
    if user_id < 0:
        return jsonify({'message': 'ID de usuário inválido'}), 400
    if note_id == None:
        return jsonify({'message': 'Senha não encontrada'}), 404
    if note_id < 0:
        return jsonify({'message': 'ID de senha inválido'}), 400
    if user_id > 0 and note_id > 0:
        result = db.session.execute(text(f"SELECT * FROM tb_users WHERE id = {user_id};"))
        user = result.fetchall()

        if len(user) != 1:
            return jsonify({'message': 'Usuário não encontrado'}), 404
        else:
            notes = db.session.execute(text(f"SELECT * FROM tb_notes WHERE user_id = {user_id};"))
            notes = notes.fetchall()
            
            if len(notes) < 1:
                return jsonify({'message': 'Nenhuma nota foi encontrada para o usuário informado.'}), 404
            if request.method == 'GET':
                
                if notes == []:
                    return jsonify({'message': 'Nenhuma senha foi encontrada para o usuário informado.'}), 404
                else:
                    note = [note for note in notes if note[0] == note_id][0]
                    
                    note = {
                        'title': note[2],
                        'conteudo': note[3],
                        'create_at': note[4],
                        'updated_at': note[5]
                    }

                    if note == []:
                        return jsonify({'message': f'Nenhuma nota com esse id {note_id} foi encontrada para o usuário informado.'}), 404
                    else:
                        return jsonify(note)
            elif request.method == 'POST':
                if notes == []:
                    return jsonify({'message': 'Nenhuma nota foi encontrada para o usuário informado.'}), 404
                else:
                    note = [note for note in notes if note[0] == note_id][0]

                    if note == []:
                        return jsonify({'message': f'Nenhuma nota com esse id {note_id} foi encontrada para o usuário informado.'}), 404
                    else:
                        if request.get_json() == None:
                            return jsonify({'message': 'Nenhuma nota foi informada.'}), 400
                        else:
                            data = request.get_json()
                            sql = f"UPDATE tb_notes SET title = '{data['title']}', content = '{data['content']}', updated_at = NOW() WHERE id = '{note_id}'"

                            db.session.execute(text(sql))
                            db.session.commit()

                            return jsonify({'message': 'Atualização feita com sucesso.'}), 200
            else:
                nota = db.session.execute(text(f"SELECT * FROM tb_notes WHERE id = {note_id}"))
                nota = nota.fetchall()

                if len(nota) < 1:
                    return jsonify({'message': f'Nenhuma nota com o id {note_id} foi encontrada para o usuário informado.'}), 404
                note = [note for note in notes if note[0] == note_id][0]
                note = {
                    'title': note[2],
                    'conteudo': note[3],
                    'create_at': note[4],
                    'updated_at': note[5]
                }
                sql = f"DELETE FROM tb_notes WHERE id = {note_id};"
                db.session.execute(text(sql))
                db.session.commit()
                
                return jsonify({'message':'Item deletado com sucesso.'}), 200