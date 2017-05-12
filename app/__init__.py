from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from config import config


login_manager = LoginManager()
db = SQLAlchemy()
login_manager.session_protection = 'basic'

# CHECK
login_manager.login_view = 'main.login'


def create_app(config_name):

    app = Flask(__name__)

    from .main import main as main_blueprint

    app.register_blueprint(main_blueprint)

    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    login_manager.init_app(app)

    db.init_app(app)

    return app