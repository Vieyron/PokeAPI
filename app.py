from flask import Flask, render_template, jsonify, request
import requests

app = Flask(__name__)

# Función para obtener datos de la PokeAPI
def get_pokemon_data(pokemon):
    try:
        url = f'https://pokeapi.co/api/v2/pokemon/{pokemon.lower()}'
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()

            # Obtener tipos
            types = [t['type']['name'] for t in data['types']]
            
            # Obtener habilidades
            abilities = [a['ability']['name'] for a in data['abilities']]
            
            # Obtener estadísticas
            stats = {s['stat']['name']: s['base_stat'] for s in data['stats']}
            
            # Obtener imagen oficial
            official_artwork = data['sprites']['other']['official-artwork']['front_default']
            
            pokemon_info = {
                'name': data['name'].capitalize(),
                'id': data['id'],
                'types': types,
                'abilities': abilities,
                'stats': stats,
                'height': data['height'] / 10,  # Convertir a metros
                'weight': data['weight'] / 10,  # Convertir a kg
                'sprite': official_artwork or data['sprites']['front_default']
            }
            return pokemon_info
        else:
            return None
    except:
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['GET'])
def search():
    pokemon = request.args.get('pokemon', '').strip()
    if not pokemon:
        return jsonify({'error': 'Por favor, ingresa el nombre o ID de un Pokémon'})
    
    pokemon_data = get_pokemon_data(pokemon)
    if pokemon_data:
        return jsonify(pokemon_data)
    else:
        return jsonify({'error': 'Pokémon no encontrado. Intenta con otro nombre o ID.'})

if __name__ == '__main__':
    app.run(debug=True)