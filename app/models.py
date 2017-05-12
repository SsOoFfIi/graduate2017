from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import String, Integer, DateTime
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
from flask_login import UserMixin
from . import login_manager, db
from datetime import datetime


Base = declarative_base()


class UserList(db.Model):

    __tablename__ = 'User_List'

    username = Column(String(20), primary_key=True)
    type = Column(Integer, nullable=False)
    name = Column(String(20))
    pinyinName = Column(String(30))
    email = Column(String(50))
    mobile = Column(String(20))
    gender = Column(String(10))
    college = Column(String(20))
    grade = Column(String(20))
    className = Column(String(20))
    createDate = Column(String(30), nullable=False, default=datetime.now().strftime('%y-%m-%d %H:%M:%S'))
    ownCount = Column(Integer, nullable=False, server_default='0')
    joinCount = Column(Integer, nullable=False, server_default='0')

    def __init__(self):
        pass

    def create(self, engine):
        if self.__table__.exists(engine):
            pass
            # print('[Database]: UserList table already exisited')
        else:
            self.__table__.create(engine)


class User(UserMixin, db.Model):
    __tablename__ = 'User'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(20), ForeignKey('User_List.username'), unique=True, index=True)
    password = Column(String(128), nullable=False)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class TableList(db.Model):

    __tablename__ = 'Table_List'

    serialNum = Column(Integer, primary_key=True)
    tableName = Column(String(60), nullable=False)
    tablePwd = Column(String(8), nullable=False)
    owner = Column(String(20), ForeignKey('User_List.username'), nullable=False)
    tableType = Column(String(10), nullable=False)
    count = Column(Integer, nullable=False, default=0)
    createDate = Column(String(30), nullable=True)
    deadlineDate = Column(String(30), nullable=True)

    def __init__(self):
        pass

    def create(self, engine):
        if self.__table__.exists(engine):
            pass
            # print('[Database]: TableList table already exisited')
        else:
            self.__table__.create(engine)


class OptionalCTab(db.Model):
    __tablename__ = 'Optional_CTab'

    serialNum = Column(Integer, ForeignKey('Table_List.serialNum'), primary_key=True)
    subjectCount = Column(Integer, nullable=False)
    subjectString = Column(String(256), nullable=False)

    def __init__(self):
        pass

    def create(self, engine):
        if self.__table__.exists(engine):
            pass
            # print('[Database]: OptionalCTab table already exisited')
        else:
            self.__table__.create(engine)


class UserTabHis(db.Model):

    #__tablename__ = [username]_Tab_His
    __tablename__ = 'Default_Tab_His'

    serialNum = Column(Integer, ForeignKey('Table_List.serialNum'), primary_key=True)
    ownType = Column(String(10), nullable=False)
    tableName = Column(String(60))
    ownerName = Column(String(20))
    tableType = Column(String(10))
    count = Column(Integer, default=0)
    createDate = Column(String(30))
    deadlineDate = Column(String(30))


    def __init__(self, username):
        self.__table__.name = username + '_Tab_His'

    def create(self, engine):
        if self.__table__.name == 'Default_Tab_His':
            raise ValueError('Wrong tablename in creating UserTabHis.')
        else:
            self.__table__.create()


# Dynamically create OptionalCourse Table
class OptionalCourseBase(db.Model):

    __tablename__ = 'DefaultOCT'
    # __table_args__ = {'extend_existing': True}

    rowNum = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(20), ForeignKey('User_List.username'), nullable=False)
    name = Column(String(20), nullable=False)
    # editDate = Column(DateTime, nullable=False, onupdate=func.now(), server_default=func.now())
    editDate = Column(String, nullable=False, server_onupdate=datetime.now().strftime('%Y-%m-%d %H:%M:%S'), server_default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    #Dynamic Create Subject Column

    def __init__(self, serialNum):
        self.__table__.name = 't_' + str(serialNum)


# Serial Sequence Counter
class SerialSequence(db.Model):

    __tablename__ = 'SerialSequence'

    tableName = Column(String(60), primary_key=True)
    serialCount = Column(Integer, default=0)

    def create(self, engine):
        if self.__table__.exists(engine):
            pass
            # print('[Database]: OptionalCTab table already exisited')
        else:
            self.__table__.create(engine)