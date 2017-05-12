from flask import render_template, url_for, redirect, request, make_response, send_file
from . import main
from ..models import User, UserList, TableList, UserTabHis, OptionalCTab, OptionalCourseBase, SerialSequence
from flask_login import login_user, login_required, current_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask import jsonify
from sqlalchemy import Column, ForeignKey, update
from sqlalchemy.types import String, Integer, DateTime, Boolean
from sqlalchemy.sql import func
from datetime import datetime, timedelta
from app import db
import json
import tablib
import traceback


@main.route('/')
@main.route('/login/')
def login():
    return render_template('login.html')


# Userlogin
@main.route('/auth/', methods=['POST'])
def auth():
    username = request.form['username']
    password = request.form['password']

    user = User.query.filter_by(username=request.form['username']).first()
    if user is not None and check_password_hash(user.password, password):
        login_user(user)
        print('User Login')
        return redirect('/index/')

    return redirect('/login/')


# User logout
@main.route('/index/logout/', methods=['POST', 'GET'])
@login_required
def logout():
    logout_user()
    return redirect('/login/')


#HomePage
@main.route('/index/')
@login_required
def index():
    return render_template('index.html')


# JSON 'POST' current user Basic Information
@main.route('/index/userdata/', methods=['POST', 'GET'])
def userdata():
    CurrentUser = current_user.username
    # CurrentUser = '1306100062'

    user = db.session.query(UserList).filter(UserList.username == CurrentUser).first()

    Data = dict()
    data = dict()

    if user is None:
        Data['code'] = 402
        data['error'] = 'No such user.'
    else:
        Data['code'] = 200

        data['username'] = user.username
        data['name'] = user.name
        data['type'] = user.type
        data['pinyinName'] = user.pinyinName
        data['email'] = user.email
        data['mobile'] = user.mobile
        data['gender'] = user.gender
        data['college'] = user.college
        data['grade'] = user.grade
        data['className'] = user.className
        data['createDate'] = user.createDate
        data['ownCount'] = user.ownCount
        data['joinCount'] = user.joinCount

    Data['data'] = data

    return jsonify(Data)


# JSON 'POST' user table history informations
# Global variable

@main.route('/index/userhistory/', methods=['POST', 'GET'])
def userhistory():
    dataPerPage = 10
    #Get serialNum for search from web pages(-1:All, 1..n:Single Row), loaded with json
    receivedData = json.loads(request.get_data().decode())

    # receivedData = {
    #     'serialNum':100,
    #     'page':1
    # }

    Data = dict()
    data = dict()

    if isinstance(receivedData['serialNum'], int) and isinstance(receivedData['page'], int):

        if receivedData['serialNum'] == -1 or receivedData['serialNum'] > 0:
            Data['code'] = 200
            if receivedData['serialNum'] == -1:
                CurrentUser = current_user.username
                # CurrentUser = '1306100062'

                UserTabHis(CurrentUser)
                totalRow = len(UserTabHis.query.all())
                query = UserTabHis.query.paginate(receivedData['page'],dataPerPage,False)
                data['page'] = receivedData['page']
                data['pageSize'] = dataPerPage
                data['pageTotal'] = query.pages
                data['totalRow'] = totalRow
                # print(query)

                list = []
                for row in query.items:
                    rowdata = {}
                    rowdata['serialNum'] = row.serialNum
                    rowdata['ownType'] = row.ownType
                    rowdata['tableName'] = row.tableName
                    rowdata['ownerName'] = row.ownerName
                    rowdata['tableType'] = row.tableType
                    rowdata['count'] = row.count
                    rowdata['createDate'] = row.createDate
                    rowdata['deadlineDate'] = row.deadlineDate
                    list.append(rowdata)

                data['list'] = list
                Data['data'] = data

                return jsonify(Data)
            elif receivedData['serialNum'] > 0:
                check = TableList.query.filter(TableList.serialNum == receivedData['serialNum']).first()
                if check is not None:
                    CurrentUser = current_user.username
                    # CurrentUser = '1306100062'
                    UserTabHis(CurrentUser)
                    UserTabHis(CurrentUser)
                    query = UserTabHis.query.filter(UserTabHis.serialNum == receivedData['serialNum']).first()
                    queryTabList = TableList.query.filter(TableList.serialNum == receivedData['serialNum']).first()

                    query.count = queryTabList.count
                    db.session.add(query)
                    db.session.commit()

                    list = []
                    if query is None:
                        Data['code'] = 402
                        data['error'] = 'Table does\'t exists in your history.'
                    else:
                        rowdata = dict()
                        rowdata['serialNum'] = query.serialNum
                        rowdata['ownType'] = query.ownType
                        rowdata['tableName'] = query.tableName
                        rowdata['ownerName'] = query.ownerName
                        rowdata['tableType'] = query.tableType
                        rowdata['count'] = query.count
                        rowdata['createDate'] = query.createDate
                        rowdata['deadlineDate'] = query.deadlineDate
                        list.append(rowdata)

                    data['list'] = list
                    Data['data'] = data
                    return jsonify(Data)
                else:
                    Data['code'] = 402
                    data['error'] = 'Table doesn\'t exist in database'
        else:
            Data['code'] = 402
            data['error'] = 'Wrong serial number, others than [-1, >0]'
            list = []
            data['list'] = list
    else:
        Data['code'] = 402
        data['error'] = 'Wrong data type of receivedData.'



    Data['data'] = data

    return jsonify(Data)




# JSON 'POST' one specific table detail information
@main.route('/index/tabdata/', methods=['POST', 'GET'])
def presentTab():
    dataPerPage = 10

    # get serialNum from web page for searching
    receivedData = json.loads(request.get_data().decode())

    # receivedData = {
    #     'serialNum': 10,
    #     'tablePwd': '00000000',
    #     'page': 1
    # }

    Data = dict()
    data = dict()

    if isinstance(receivedData['serialNum'], int) and isinstance(receivedData['tablePwd'], str) and isinstance(receivedData['page'], int):

        query_one = db.session.query(OptionalCTab)\
            .filter(OptionalCTab.serialNum == receivedData['serialNum']).first()
        # print(query_one)

        if receivedData['serialNum'] < 1 or query_one is None:
            Data['code'] = 402
            if receivedData['serialNum'] < 1:
                data['error'] = 'Wrong serial number, others than [>=1]'
            elif query_one is None:
                data['error'] = 'Table don\'t exist in database'
            # elif receivedData['tablePwd'] != tablePwd:
            #     data['error'] = 'Wrong password for the table'
        else:
            tablelist = TableList.query.filter(TableList.serialNum == receivedData['serialNum']).first()
            tablePwd = tablelist.tablePwd

            if receivedData['tablePwd'] != tablePwd:
                Data['code'] = 402
                data['error'] = 'Wrong password for the table'
            else:
                Data['code'] = 200
                list = []
                subjectList = query_one.subjectString.replace('＃', '#').split('#')
                subjectCount = query_one.subjectCount
                data['subjectCount'] = subjectCount
                data['subjectName'] = subjectList
                data['tableName'] = tablelist.tableName

                # Query from dynamic table model t_?
                tabAttr = dict()
                for subject in subjectList:
                    tabAttr[subject] = Column(Boolean)
                tabAttr['__table_args__'] = {'extend_existing': True}
                OptionalCourseTable = type('OptionalCourseTable', (OptionalCourseBase,), tabAttr)
                OptionalCourseTable.__table__.name = 't_' + str(receivedData['serialNum'])
                totalRow = len(OptionalCourseTable.query.all())
                query_two = OptionalCourseTable.query.paginate(receivedData['page'],dataPerPage,False)
                
                visualize = dict()
                for subject in subjectList:
                    countstr = 'SELECT * from t_' + str(receivedData['serialNum']) + ' WHERE \"' + subject + '\" == 1;'
                    visualize[subject] = len(db.session.execute(countstr).fetchall())
                    print(visualize[subject])
                data['visualize'] = visualize

                if query_two is not None:
                    for row in query_two.items:
                        rawdata = dict()
                        rawdata['rowNum'] = row.rowNum
                        rawdata['username'] = row.username
                        rawdata['name'] = row.name
                        rawdata['editDate'] = row.editDate

                        for name in subjectList:
                            rawdata[name] = row.__dict__[name]
                        list.append(rawdata)
                data['page'] = receivedData['page']
                data['pageSize'] = dataPerPage
                data['pageTotal'] = query_two.pages
                data['totalRow'] = totalRow
                data['list'] = list
    else:
        Data['code'] = 402
        data['error'] = 'Wrong data type of receiveDate.'
    Data['data'] = data

    return jsonify(Data)


@main.route('/index/optionalcourse/userrow/', methods = ['POST', 'GET'])
def userRow():

    # get serialNum from web page for searching
    receivedData = json.loads(request.get_data().decode())

    # receivedData = {
    #     'username': '1306100062',
    #     'serialNum': 1,
    #     'tablePwd': '00000000'
    # }

    Data = dict()
    data = dict()

    if isinstance(receivedData['username'], str) and isinstance(receivedData['serialNum'], int) and isinstance(receivedData['tablePwd'], str):
        tablelist = TableList.query.filter(TableList.serialNum == receivedData['serialNum']).first()
        if tablelist is not None:
            query_pwd = TableList.query.filter(TableList.serialNum == receivedData['serialNum']).first().tablePwd
            if receivedData['tablePwd'] == query_pwd:

                query_one = db.session.query(OptionalCTab) \
                    .filter(OptionalCTab.serialNum == receivedData['serialNum']).first()

                if receivedData['serialNum'] < 1 or query_one is None:
                    Data['code'] = 402
                    if receivedData['serialNum'] < 1:
                        data['error'] = 'Wrong serial number, others than [>=1]'
                    elif query_one is None:
                        data['error'] = 'Table doesn\'t exist in database'
                else:
                    Data['code'] = 200
                    row = dict()
                    subjectList = query_one.subjectString.replace('＃', '#').split('#')
                    subjectCount = query_one.subjectCount
                    data['subjectCount'] = subjectCount
                    data['subjectName'] = subjectList
                    data['tableName'] = TableList.query.filter(
                    TableList.serialNum == receivedData['serialNum']).first().tableName
                    data['username'] = receivedData['username']
                    UserTabHis(receivedData['username'])
                    queryuth = UserTabHis.query.filter(UserTabHis.serialNum == receivedData['serialNum']).first()
                    data['count'] = tablelist.count
                    data['ownType'] = queryuth.ownType

                    # Query from dynamic table model t_?
                    tabAttr = dict()
                    for subject in subjectList:
                        tabAttr[subject] = Column(Boolean)
                    tabAttr['__table_args__'] = {'extend_existing': True}
                    OptionalCourseTable = type('OptionalCourseTable', (OptionalCourseBase,), tabAttr)
                    OptionalCourseTable.__table__.name = 't_' + str(receivedData['serialNum'])
                    totalRow = len(OptionalCourseTable.query.all())
                    query_two = OptionalCourseTable.query.filter(OptionalCourseTable.username == receivedData['username']).first()

                    if query_two is not None:
                        for name in subjectList:
                            row[name] = query_two.__dict__[name]
                        data['rowNum'] = query_two.rowNum
                        data['row'] = row
                    else:
                        # Data['code'] = 402
                        # data['error'] = 'User not yet insert table data.'
                        data['row'] = row
            else:
                Data['code'] = 402
                data['error'] = 'Wrong table password.'
        else:
            Data['code'] = 402
            data['error'] = 'Table does\'t exist in database.'
    else:
        Data['code'] = 402
        data['error'] = 'Wrong data type of receiveDate.'

    Data['data'] = data

    return jsonify(Data)


# JSON received user inforamtion to modify their optional course table row
@main.route('/index/optionalcourse/modify/', methods = ['POST', 'GET'])
def opCourseModify():
    # get serialNum from web page for searching
    receivedData = json.loads(request.get_data().decode())

    # Received Data
    # receivedData = {
    #     'serialNum': 1,
    #     'type': 0,
    #     'rowNum': 51,
    #     'username': '1306100065',
    #     'name': 'Peter',
    #     'subjectName': {
    #         '计算机网络': 1,
    #         '计算机组成原理': 1,
    #         '操作系统': 0,
    #         '数据结构': 1
    #     }
    #
    # }

    Data = dict()
    data = dict()

    if isinstance(receivedData['serialNum'], int) and isinstance(receivedData['type'], int) and isinstance(receivedData['rowNum'], int) and isinstance(receivedData['username'], str) and isinstance(receivedData['name'], str):

        # Create Dynamic table Model
        query_one = db.session.query(OptionalCTab) \
            .filter(OptionalCTab.serialNum == receivedData['serialNum']).first()
        subjectList = query_one.subjectString.replace('＃', '#').split('#')
        subjectCount = query_one.subjectCount
        tabAttr = dict()
        for subject in subjectList:
            tabAttr[subject] = Column(Boolean)
        tabAttr['__table_args__'] = {'extend_existing': True}
        OptionalCourseTable = type('OptionalCourseTable', (OptionalCourseBase,), tabAttr)
        OptionalCourseTable.__table__.name = 't_' + str(receivedData['serialNum'])

        #Insert
        if receivedData['type'] == 1:
            query = OptionalCourseTable.query.filter(OptionalCourseTable.username == receivedData['username']).all()

            if len(query) == 0:
                try:
                    oct = OptionalCourseTable(receivedData['serialNum'])
                    oct.username = receivedData['username']
                    oct.name = receivedData['name']
                    for subject in subjectList:
                        # oct.__dict__[subject] = receivedData[subject]
                        oct.__dict__[subject] = receivedData['subjectName'][subject]
                        print(receivedData['subjectName'][subject])
                    tablist = TableList.query.filter(TableList.serialNum == receivedData['serialNum']).first()
                    UserTabHis(receivedData['username'])
                    if UserTabHis.query.filter(UserTabHis.serialNum == receivedData['serialNum']).first() is None:
                        tablelist = TableList.query.filter(TableList.serialNum == receivedData['serialNum']).first()
                        theownerName = UserList.query.filter(UserList.username == tablelist.owner).first().name
                        # Insert into User_Tab_His
                        usertabhis = UserTabHis(receivedData['username'])
                        usertabhis.serialNum = tablelist.serialNum
                        usertabhis.tableName = tablelist.tableName
                        usertabhis.ownType = 'attend'
                        usertabhis.ownerName = theownerName
                        usertabhis.count = tablelist.count
                        usertabhis.tableType = tablelist.tableType
                        usertabhis.createDate = tablelist.createDate
                        usertabhis.deadlineDate = tablelist.deadlineDate
                        db.session.add(usertabhis)

                    tablist.count += 1
                    db.session.add(oct)
                    db.session.add(tablist)
                    db.session.commit()
                except Exception as e:
                    Data['code'] = 402
                    data['error'] = 'Error in inserting a row.'
                    print('Error: ', e)
                    db.session.rollback()
                else:
                    Data['code'] = 200
            else:
                Data['code'] = 402
                data['error'] = 'This user\'s info already existed.'

            data['type'] = receivedData['type']

        #Update
        elif receivedData['type'] == 0:
            # UPDATE "t_2" SET Marketing = 1, FrenchBasic = 1, WesternEconomy = 1, CompanyManaging = 1 WHERE "t_2".rowNum = 1;
            query = OptionalCourseTable.query.filter(OptionalCourseTable.username == receivedData['username']).all()
            if len(query) == 0:
                Data['code'] = 402
                data['error'] = 'User to be update not existed.'
            elif len(query) == 1:
                if query[0].username == receivedData['username']:
                    try:
                        dbstr = 'UPDATE ' + '"t_' + str(receivedData['serialNum']) + '" SET \"' + subjectList[0] + '\" = ' + str(receivedData['subjectName'][subjectList[0]])
                        i = 1
                        while i < subjectCount:
                            dbstr += (', \"' + subjectList[i] + '\" = ' + str(receivedData['subjectName'][subjectList[i]]))
                            i += 1
                        dbstr += (', editDate = \"' + datetime.now().strftime('%Y-%m-%d %H:%M:%S') + '\" WHERE "t_' + str(receivedData['serialNum']) + '".rowNum = ' + str(receivedData['rowNum']) + ';')

                        print(dbstr)
                        db.session.execute(dbstr)
                        db.session.commit()
                    except Exception as e:
                        Data['code'] = 402
                        data['error'] = 'Error in updating a row.'
                        print('Error: ', e)
                        traceback.print_exc()
                        db.session.rollback()
                    else:
                        Data['code'] = 200
                else:
                    Data['code'] = 402
                    data['error'] = 'User\'s rowNum and username not match'
            else:
                Data['code'] = 402
                data['error'] = 'User\'s info ambiguous, exists more than one row'


            data['type'] = receivedData['type']

        #Delete
        elif receivedData['type'] == -1:
            query = OptionalCourseTable.query.filter(OptionalCourseTable.rowNum == receivedData['rowNum']).all()

            if len(query) == 0:
                Data['code'] = 402
                data['error'] = 'User to be deleted not existed'
            elif len(query) == 1:
                try:
                    db.session.delete(query[0])
                    db.session.commit()
                except Exception as e:
                    Data['code'] = 402
                    data['error'] = 'Error in deleting a row.'
                    print('Error: ', e)
                    db.session.rollback()
                else:
                    Data['code'] = 200
            else:
                Data['code'] = 402
                data['error'] = 'User\'s info ambiguous, exists more than one row'

            data['type'] = receivedData['type']

        else:
            Data['code'] = 402
            data['error'] = 'Received a wrong operation type, others than (1, 0, -1)'
    else:
        Data['code'] = 402
        data['error'] = 'Wrong data type of receivedData.'

    Data['data'] = data

    return jsonify(Data)


# Testing NOT DONE
@main.route('/index/optionalcourse/create/', methods = ['POST', 'GET'])
def opCourseCreate():
    # Received data from web pages
    receivedData = json.loads(request.get_data().decode())

    # receivedData = {
    #     'owner': '1306100062',
    #     'tableName': '136班开心就好',
    #     'tablePwd': '00000000',
    #     'subjectString': '计算机网络#计算机组成原理#操作系统#数据结构',
    #     'period': 5
    # }

    Data = dict()
    data = dict()

    if isinstance(receivedData['owner'], str) and isinstance(receivedData['tableName'], str) and isinstance(receivedData['tablePwd'], str) and isinstance(receivedData['subjectString'], str) and isinstance(receivedData['period'], int):

        subjectList = receivedData['subjectString'].replace('＃', '#').split('#')

        # SerialNum Sequence
        currentSerial = db.session.query(SerialSequence).\
            filter(SerialSequence.tableName == 'Table_List').first()
        currentSerial.serialCount += 1
        # db.session.add(currentSerial)

        try:
            # Create Dynamic Table t_serialNum
            tabAttr = {}
            for subject in subjectList:
                tabAttr[subject] = Column(Boolean)
            tabAttr['__table_args__'] = {'extend_existing': True}
            OptionalCourseTable = type('OptionalCourseTable', (OptionalCourseBase,), tabAttr)
            OptionalCourseTable.__table__.name = 't_' + str(currentSerial.serialCount)
            OptionalCourseTable.__table__.create(db.engine)
        except Exception as e:
            Data['code'] = 402
            data['error'] = 'Error in creating OptionalCourse table'
            print('Error: ', e)
        else:
            try:
                db.session.add(currentSerial)

                # Insert into OptionalCTab()
                optionalctab = OptionalCTab()
                optionalctab.serialNum = currentSerial.serialCount
                optionalctab.subjectString = receivedData['subjectString']
                optionalctab.subjectCount = len(subjectList)
                db.session.add(optionalctab)
                # print(optionalctab)

                # Insert into Table_List
                tableListRow = TableList()
                tableListRow.serialNum = currentSerial.serialCount
                tableListRow.tableName = str(currentSerial.serialCount) + '_' + receivedData['tableName']
                tableListRow.owner = receivedData['owner']
                tableListRow.tablePwd = receivedData['tablePwd']
                tableListRow.tableType = 'OPC'
                now = datetime.now()
                deadline = now + timedelta(days=receivedData['period'])
                tableListRow.createDate = now.strftime('%Y-%m-%d %H:%M:%S')
                tableListRow.deadlineDate = deadline.strftime('%Y-%m-%d %H:%M:%S')
                db.session.add(tableListRow)
                # print(tableListRow)

                # ownCount from User_List ++
                userOwnCount = db.session.query(UserList). \
                    filter(UserList.username == receivedData['owner']).first()
                userOwnCount.ownCount += 1
                ownerName = userOwnCount.name
                db.session.add(userOwnCount)
                # print(userOwnCount)

                # Insert into User_Tab_His
                usertabhis = UserTabHis(receivedData['owner'])
                usertabhis.serialNum = currentSerial.serialCount
                usertabhis.tableName = str(currentSerial.serialCount) + '_' + receivedData['tableName']
                usertabhis.ownType = 'own'
                usertabhis.ownerName = ownerName
                usertabhis.tableType = 'OPC'
                usertabhis.createDate = now.strftime('%Y-%m-%d %H:%M:%S')
                usertabhis.deadlineDate = deadline.strftime('%Y-%m-%d %H:%M:%S')
                db.session.add(usertabhis)
                # print(usertabhis)

                db.session.commit()
            except Exception as e:
                Data['code'] = 402
                data['error'] = 'Error in resolving the references table'
                print('Error: ', e)
                db.session.rollback()
                OptionalCourseTable.__table__.drop(db.engine)
            else:
                Data['code'] = 200
                data['serialNum'] = currentSerial.serialCount
    else:
        Data['code'] = 402
        data['error'] = 'Wrong data type of receivedData.'

    Data['data'] = data

    return jsonify(Data)



# JSON received basic info of the data to be deleted
# TEST NEEDED
@main.route('/index/tabdelete/', methods=['POST', 'GET'])
def tabdelete():
    # Received data from web pages
    receivedData = json.loads(request.get_data().decode())

    # receivedData = {
    #     'serialNum':1,
    #     'username':'1306100062'
    # }

    Data = dict()
    data = dict()

    if isinstance(receivedData['serialNum'], int) and isinstance(receivedData['username'], str):

        if receivedData['serialNum']  < 1:
            Data['code'] = 402
            data['error'] = 'Wrong serial number, other than [>0]'
        else:
            # t_serial
            targetTable = 't_' + str(receivedData['serialNum'])

            # Delete row from User_Tab_His
            UserTabHis(receivedData['username'])
            usertabhis = db.session.query(UserTabHis).filter(UserTabHis.serialNum == receivedData['serialNum']).all()
            if len(usertabhis) > 0 and usertabhis[0].ownType == 'own':
                # Delete row from userTabHis
                try:
                    for usertabhisrow in usertabhis:
                        db.session.delete(usertabhisrow)

                    # Delete row from Table_List
                    tablelist = db.session.query(TableList).filter(TableList.serialNum == receivedData['serialNum']).all()
                    if len(tablelist) > 0:
                        for tablelistrow in tablelist:
                            db.session.delete(tablelistrow)

                    # Deleete row from Optional_CTab
                    optionalctab = OptionalCTab.query.filter(OptionalCTab.serialNum == receivedData['serialNum']).all()
                    if len(optionalctab) > 0:
                        for optionalctabrow in optionalctab:
                            db.session.delete(optionalctabrow)

                    # Update row from User_List
                    userlist = db.session.query(UserList).filter(UserList.username == receivedData['username']).first()
                    userlist.ownCount -= 1
                    db.session.add(userlist)

                    # Drop table
                    execution = 'Drop table ' + targetTable + ';'
                    db.session.execute(execution)

                    db.session.commit()
                except Exception as e:
                    Data['code'] = 402
                    data['error'] = 'Error in deleting reference table or row'
                    print('Error: ', e)
                    db.session.rollback()
                else:
                    Data['code'] = 200
            else:
                Data['code'] = 402
                data['error'] = 'User does\'t own the table or table does\'t exist.'
    else:
        Data['code'] = 402
        data['error'] = 'Wrong data type of receivedData.'

    Data['data'] = data

    return jsonify(Data)


@main.route('/account/pwdmodify/', methods=['POST', 'GET'])
def pwdmodify():
    # Received data from web pages
    receivedData = json.loads(request.get_data().decode())

    # receivedData = {
    #     'username':'1306100062',
    #     'oldpwd':'1306100062',
    #     'newpwd':'1306100062'
    # }

    Data = dict()
    data = dict()

    if isinstance(receivedData['username'], str) and isinstance(receivedData['oldpwd'], str) and isinstance(receivedData['newpwd'], str):
        user = User.query.filter(User.username == receivedData['username']).first()
        if user is None:
            Data['code'] = 402
            data['error'] = 'User does\'t exist'
        else:
            if check_password_hash(user.password, receivedData['oldpwd']):
                try:
                    user.password = generate_password_hash(receivedData['newpwd'])
                    db.session.add(user)
                    db.session.commit()
                except Exception as e:
                    Data['code'] = 402
                    data['error'] = 'Error in updating new password.'
                    print('Error: ', e)
                    db.session.rollback()
                else:
                    Data['code'] = 200
            else:
                Data['code'] = 402
                data['error'] = 'Error in validating the old password.'
    else:
        Data['code'] = 402
        data['error'] = 'Wrong data type of receivedData.'
    Data['data'] = data

    return jsonify(Data)

@main.route('/file/excelexport/<serialNum>', methods = ['POST', 'GET'])
def excelexport(serialNum):

    oct = OptionalCTab.query.filter(OptionalCTab.serialNum == int(serialNum)).first()
    subjectList = oct.subjectString.replace('＃', '#').split('#')
    dyHeader = ['学号', '姓名']

    for subject in subjectList:
        dyHeader.append(subject)

    headers = tuple(dyHeader)

    tabAttr = dict()
    for subject in subjectList:
        tabAttr[subject] = Column(Boolean)
    tabAttr['__table_args__'] = {'extend_existing': True}
    OptionalCourseTable = type('OptionalCourseTable', (OptionalCourseBase,), tabAttr)
    OptionalCourseTable.__table__.name = 't_' + str(serialNum)

    query = OptionalCourseTable.query.all()

    rows = list()
    for datarow in query:
        row = [datarow.__dict__['username'], datarow.__dict__['name']]
        for subject in subjectList:
            row.append(datarow.__dict__[subject])
        rows.append(tuple(row))



    data = tablib.Dataset(*rows, headers=headers)
    response = make_response(data.xlsx)
    response.headers['Content-Disposition'] = "attachment; filename=test.xlsx;"
    return response