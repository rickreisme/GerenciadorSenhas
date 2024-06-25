from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

is_on_bp = Blueprint('is_on_bp', __name__)

@is_on_bp.route('/', methods=['GET'])
def getApiStatus():
    return jsonify({
        "message": "API em execução"
    }), 200