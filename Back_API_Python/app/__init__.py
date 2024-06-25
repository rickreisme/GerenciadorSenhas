from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from app import config
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS, cross_origin

bd_config = config.bd_config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    cors = CORS(app, resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{bd_config[0]['user']}:{bd_config[0]['password']}@{bd_config[0]['host']}:{bd_config[0]['port']}/{bd_config[0]['database']}"
    db.init_app(app)

    @app.route('/login/', methods=['POST'])
    def login():
        email = request.json.get('email', None)
        senha = request.json.get('senha', None)

        user = db.session.execute(text(f"SELECT * FROM tb_users WHERE email = '{email}';"))
        user = user.fetchall()
        print(email, senha, user)
        if len(user) != 1:
            return jsonify({'message': 'Usuário não encontrado'}), 404
        else:
            return jsonify({"message":"sucess", "idUsuario": user[0][0]}), 200

    with app.app_context():
        from .routes import register_routes
        register_routes(app)

    return app