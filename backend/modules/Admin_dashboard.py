from flask_restful import Resource, reqparse
from firebase_admin import credentials, firestore, initialize_app

# Initialize Firestore DB
cred = credentials.Certificate('key.json')
default_app = initialize_app(cred, name='admin_dashboard')
db = firestore.client(default_app)

class Units_sold(Resource):
    def get(self): 
        docs = db.collection(u'products').stream()
        units_sold = 0
        for doc in docs:
            units_sold += doc.get("units_sold")

        return {"units_sold": units_sold}

class Total_revenue(Resource):
    def get(self):
        docs = db.collection(u'products').stream()
        revenue = 0
        for doc in docs:
            current = doc.get("units_sold") * doc.get("price")
            revenue += current

        return {"total_revenue": revenue}