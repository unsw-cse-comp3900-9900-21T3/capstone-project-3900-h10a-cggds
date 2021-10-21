from flask import Flask, app
from flask_restful import Api, Resource, reqparse
from firebase_admin import credentials, firestore, initialize_app

import pyrebase

# Initialize Firestore DB
cred = credentials.Certificate('key.json')
default_app = initialize_app(cred, name='user')
db = firestore.client(default_app)

parser = reqparse.RequestParser()
parser.add_argument('uid', type=str, help='User ID required', required=True)
parser.add_argument('fname', type=str)
parser.add_argument('lname', type=str)
parser.add_argument('email', type=str)
parser.add_argument('password', type=str)
parser.add_argument('address', type=str)
parser.add_argument('purchaseHistory', type= list)

# Pyrebase
config = {
  "apiKey": "AIzaSyAVOqrvODx6KS-xBGs5guJTrKBJjduEjRI",
  "authDomain": "nocta-tech.firebaseapp.com",
  "databaseURL": "https://nocta-tech.firebaseio.com",
  "storageBucket": "nocta-tech.appspot.com",
  "serviceAccount": "key.json"
}

firebase = pyrebase.initialize_app(config)
authP = firebase.auth()

class User_Get(Resource):
    # Get user info
    def get(self, uid):

        info = authP.get_account_info(uid)
        
        email = info['users'][0]['email']

        doc_ref = db.collection(u'users').document(email)
        
        if user_exists(doc_ref):
            return doc_ref.get().to_dict()
        else:
            return {"message": "User ID is not valid"}, 400

class User(Resource):
    
    # Update User Info
    def put(self):
        
        args = parser.parse_args()
        
        info = authP.get_account_info(args.uid)
        
        email = info['users'][0]['email']
        
        doc_ref = db.collection(u'users').document(email)
        doc = doc_ref.get()
        if doc.exists is not True:
            return {'error': 'User ID is not valid'}, 404
            
        if args.fname != None:
            doc_ref.update({
                u'first': args.fname
            })
        
        if args.lname != None:
            doc_ref.update({
                u'last': args.lname
            })
        
        if args.email != None:
            doc_ref.update({
                u'email' : args.email
            })
        
        if args.address != None:
            doc_ref.update({
                u'adress' : args.address
            })
    
        if args.purchaseHistory != None:
            doc_ref.update({
                u'purchase history': args.purchaseHistory
            })

        return {'message' : 'User updated successfully'}
        
class User_add_productID(Resource):
    # given a productid, add to users purchase history
    def post(self, productID):
        args = parser.parse_args()
        
        info = authP.get_account_info(args.uid)
        
        email = info['users'][0]['email']
        
        doc_ref = db.collection(u'users').document(email)

        if user_exists(doc_ref):
            doc_ref.update({u'purchase_history': firestore.ArrayUnion([productID])})

            return {"message": "Success"}

        else:
            return {"message": "User ID is not valid"}, 400


def user_exists(doc_ref):
    doc = doc_ref.get()
    return doc.exists
