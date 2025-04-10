'''
Date: 2025-04-10
Author: Jason Jiwan, Emilio Stadthagen
Description: This code implements a Flask web application for Joe Ts, a restaurant that allows users to view the menu, add items to their cart, and proceed to payment. The application uses Flask-Session for session management and includes routes for menu display, cart management, and order tracking.
'''
# Import necessary libraries
from flask import Flask, render_template, redirect, url_for, session, request, jsonify
from flask_session import Session
import os
import random
import string

# define a class for the Joe Ts application
class JoeTsApp:
    """
    Joe Ts Application Class
    This class initializes the Flask application, sets up session management,
    and defines the routes for the application.
    """
    def __init__(self):
        self.app = Flask(__name__)
        self.app.config['SECRET_KEY'] = 'your-secret-key'
        self.app.config['SESSION_TYPE'] = 'filesystem'
        Session(self.app)
        # Set up the session to store cart items
        self.MENU_ITEMS = {
            "Appetizers": [
                {"name": "Chile con Queso", "price": 8.99, "description": "A warm, creamy blend of melted cheese with green chiles, served with tortilla chips.", "image": "chile_con_queso.png"},
                {"name": "Guacamole", "price": 7.99, "description": "Freshly made guacamole with ripe avocados, tomatoes, onions, and cilantro, served with tortilla chips.", "image": "guacamole.png"},
                {"name": "Nachos Supreme", "price": 9.99, "description": "Crispy tortilla chips topped with melted cheese, jalapeños, beans, sour cream, and your choice of beef or chicken.", "image": "nachos_supreme.png"}
            ],
            "Main Courses": [
                {"name": "Beef Fajitas", "price": 15.99, "description": "Sizzling grilled beef strips with onions and peppers, served with warm tortillas.", "image": "beef_fajitas.png"},
                {"name": "Chicken Enchiladas", "price": 12.99, "description": "Tender chicken wrapped in corn tortillas, topped with green tomatillo sauce and cheese.", "image": "chicken_enchiladas.png"},
                {"name": "Carne Asada", "price": 17.99, "description": "Grilled marinated steak served with rice, beans, and grilled vegetables.", "image": "carne_asada.png"},
                {"name": "Shrimp Tacos", "price": 14.99, "description": "Three soft tacos filled with grilled shrimp, cabbage slaw, and chipotle crema.", "image": "shrimp_tacos.png"},
                {"name": "Vegetarian Burrito", "price": 11.99, "description": "A flour tortilla stuffed with seasoned vegetables, black beans, rice, and cheese.", "image": "vegetarian_burrito.png"}
            ],
            "Desserts": [
                {"name": "Flan", "price": 4.99, "description": "A classic caramel custard dessert with a silky texture and rich flavor.", "image": "flan.png"},
                {"name": "Churros", "price": 5.99, "description": "Crispy fried dough sticks dusted with cinnamon sugar, served with a chocolate dipping sauce.", "image": "churros.png"},
                {"name": "Tres Leches Cake", "price": 6.99, "description": "A light sponge cake soaked in three milks, topped with whipped cream.", "image": "tres_leches_cake.png"}
            ],
            "Drinks": [
                {"name": "Margarita", "price": 7.99, "description": "A refreshing blend of tequila, lime, and triple sec, served with a salted rim.", "image": "margarita.png"},
                {"name": "Horchata", "price": 3.99, "description": "A sweet, creamy rice drink flavored with cinnamon and vanilla.", "image": "horchata.png"},
                {"name": "Mexican Coke", "price": 2.99, "description": "Classic Coca-Cola in a glass bottle, made with cane sugar.", "image": "mexican.png"},
                {"name": "Agua Fresca", "price": 3.49, "description": "A refreshing fruit drink, available in flavors like watermelon or pineapple.", "image": "agua_fresca.png"}
            ]
        }

        self.setup_routes()
    # Generate a random order number
    # This function generates a random order number consisting of 8 alphanumeric characters
    def generate_order_number(self):
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        
    # Find an item by name
    def find_item_by_name(self, item_name):
        for category, items in self.MENU_ITEMS.items():
            matching_items = [item for item in items if item['name'] == item_name]
            if matching_items:
                return matching_items[0]
        return None
        
    # Set up the routes for the Flask application
    def setup_routes(self):
        @self.app.route('/')
        def menu():
            if 'cart' not in session:
                session['cart'] = []
            return render_template('menu.html', menu_items=self.MENU_ITEMS)

        @self.app.route('/add-to-cart', methods=['POST'])
        def add_to_cart(): # This route handles adding items to the cart
            item_name = request.form.get('item_name')
            item = self.find_item_by_name(item_name)

            if not item:
                return jsonify({'error': 'Item not found'}), 404

            cart = session.get('cart', [])
            item_exists = False
            for cart_item in cart:
                if cart_item['name'] == item_name:
                    cart_item['quantity'] += 1
                    item_exists = True
            
            if not item_exists:
                cart.append({
                    'name': item['name'],
                    'price': item['price'],
                    'quantity': 1,
                    'customizations': {}
                })

            session['cart'] = cart
            session.modified = True

            return jsonify({'message': 'Item added to cart', 'cart_count': sum(item['quantity'] for item in cart)})

        @self.app.route('/remove-from-cart', methods=['POST'])
        def remove_from_cart(): # This route handles removing items from the cart
            item_name = request.form.get('item_name')
            cart = session.get('cart', [])
            cart = [item for item in cart if item['name'] != item_name]
            session['cart'] = cart
            session.modified = True

            subtotal = sum(item['price'] * item['quantity'] for item in cart)
            return jsonify({
                'message': 'Item removed from cart',
                'cart_count': sum(item['quantity'] for item in cart),
                'subtotal': subtotal,
                'cart': cart
            })

        @self.app.route('/cart-count')
        def cart_count(): # This route returns the current count of items in the cart
            cart = session.get('cart', [])
            cart_count = sum(item['quantity'] for item in cart)
            return jsonify({'cart_count': cart_count})

        @self.app.route('/payment')
        def payment(): # This route handles the payment process
            cart = session.get('cart', [])
            if not cart:
                return redirect(url_for('menu'))

            subtotal = sum(item['price'] * item['quantity'] for item in cart)
            tip = 0.00
            total = subtotal + tip

            order_number = self.generate_order_number()
            table_number = random.randint(1, 50)
            items = ", ".join([item['name'] for item in cart])

            session['order_details'] = {
                'order_number': order_number,
                'table_number': table_number,
                'items': items,
                'total': total
            }

            return render_template('payment.html', cart=cart, subtotal=subtotal, tip=tip, total=total)

        @self.app.route('/track-order')
        def track_order(): # This route handles tracking the order
            order_details = session.get('order_details', {})
            if not order_details:
                return redirect(url_for('menu'))

            return render_template(
                'track_order.html',
                order_number=order_details['order_number'],
                table_number=order_details['table_number'],
                items=order_details['items'],
                total=order_details['total']
            )

    def run(self): # This function runs the Flask application
        if not os.path.exists('static'):
            os.makedirs('static')
        if not os.path.exists('static/css'):
            os.makedirs('static/css')
        if not os.path.exists('static/js'):
            os.makedirs('static/js')
        if not os.path.exists('templates'):
            os.makedirs('templates')
        self.app.run(debug=True, port=5000)


if __name__ == "__main__": # This block checks if the script is being run directly
    app_instance = JoeTsApp()
    app_instance.run()
