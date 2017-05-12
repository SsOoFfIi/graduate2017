from app import create_app
from flask_script import Manager
from app.models import User, UserList, TableList, UserTabHis, OptionalCTab, SerialSequence
from werkzeug.security import generate_password_hash
from sqlalchemy import create_engine
from config import DevelopmentConfig
from app import db
from config import config


app = create_app('development')
# manager = Manager(app)


# table initialization
def tableInit():
    eng = create_engine(DevelopmentConfig.SQLALCHEMY_DATABASE_URI)

    if UserList.__table__.exists(eng):
        pass
    else:
        UserList.__table__.create(eng)

    if User.__table__.exists(eng):
        pass
    else:
        User.__table__.create(eng)

    if TableList.__table__.exists(eng):
        pass
    else:
        TableList.__table__.create(eng)

    if OptionalCTab.__table__.exists(eng):
        pass
    else:
        OptionalCTab.__table__.create(eng);

    if SerialSequence.__table__.exists(eng):
        pass
    else:
        SerialSequence.__table__.create(eng);
        ss = SerialSequence()
        ss.tableName = 'Table_List'
        ss.serialCount = 0

        with app.app_context():
            db.session.add(ss)
            db.session.commit()

    uth = UserTabHis('1306100062')
    if uth.__table__.exists(eng):
        pass
    else:
        uth.__table__.create(eng)

    uth = UserTabHis('1306100065')
    if uth.__table__.exists(eng):
        pass
    else:
        uth.__table__.create(eng)

    # opc = OptionalCourseBase('1')
    # if opc.__table__.exists(eng):
    #     pass
    # else:
    #     opc.__table__.create(eng)
    #
    # opc = OptionalCourseBase('2')
    # if opc.__table__.exists(eng):
    #     pass
    # else:
    #     opc.__table__.create(eng)


def rowInsert():
    # eng = create_engine(DevelopmentConfig.SQLALCHEMY_DATABASE_URI)
    user = User()
    user.username = '1306100065'
    pwd = '1306100065'
    pwd_hash = generate_password_hash(pwd)
    user.password = pwd_hash



    with app.app_context():
        db.session.add(user)
        db.session.commit()


if __name__ == '__main__':

    # manager.run(debug = True)

    tableInit()
    # rowInsert()



    app.run(debug=True)