def register_routes(app):
    from .user_routes import user_bp
    from .main_route import is_on_bp
    from .password_routes import password_bp
    from .generate_pass_routes import generate_pass_bp
    from .note_routes import note_bp
    from .favorite_route import favorite_bp
    from .get_all_data import get_all_data_bp
    from .import_route import import_bp
    
    app.register_blueprint(user_bp)
    app.register_blueprint(is_on_bp)
    app.register_blueprint(password_bp)
    app.register_blueprint(generate_pass_bp)
    app.register_blueprint(note_bp)
    app.register_blueprint(favorite_bp)
    app.register_blueprint(get_all_data_bp)
    app.register_blueprint(import_bp)