document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const pokemonCard = document.getElementById('pokemon-card');
    const errorMessage = document.getElementById('error-message');
    const loading = document.getElementById('loading');
    
    // Elementos de la tarjeta de Pokémon
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonId = document.getElementById('pokemon-id');
    const pokemonImg = document.getElementById('pokemon-img');
    const pokemonTypes = document.getElementById('pokemon-types');
    const pokemonHeight = document.getElementById('pokemon-height');
    const pokemonWeight = document.getElementById('pokemon-weight');
    const pokemonAbilities = document.getElementById('pokemon-abilities');
    const pokemonStats = document.getElementById('pokemon-stats');
    
    // Función para buscar Pokémon
    function searchPokemon() {
        const query = searchInput.value.trim();
        if (!query) return;
        
        showLoading();
        hideError();
        hidePokemonCard();
        
        fetch(`/search?pokemon=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                hideLoading();
                
                if (data.error) {
                    showError(data.error);
                } else {
                    displayPokemon(data);
                }
            })
            .catch(error => {
                hideLoading();
                showError('Error al conectar con el servidor');
                console.error('Error:', error);
            });
    }
    
    // Función para mostrar los datos del Pokémon
    function displayPokemon(pokemon) {
        // Nombre e ID
        pokemonName.textContent = pokemon.name;
        pokemonId.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
        
        // Imagen
        pokemonImg.src = pokemon.sprite;
        pokemonImg.alt = pokemon.name;
        
        // Tipos
        pokemonTypes.innerHTML = '';
        pokemon.types.forEach(type => {
            const typeSpan = document.createElement('span');
            typeSpan.textContent = type;
            typeSpan.classList.add('type', `type-${type}`);
            pokemonTypes.appendChild(typeSpan);
        });
        
        // Altura y peso
        pokemonHeight.textContent = pokemon.height;
        pokemonWeight.textContent = pokemon.weight;
        
        // Habilidades
        pokemonAbilities.innerHTML = '';
        pokemon.abilities.forEach(ability => {
            const li = document.createElement('li');
            li.textContent = ability;
            pokemonAbilities.appendChild(li);
        });
        
        // Estadísticas
        pokemonStats.innerHTML = '';
        for (const [statName, statValue] of Object.entries(pokemon.stats)) {
            const statDiv = document.createElement('div');
            statDiv.classList.add('stat');
            
            const statNameSpan = document.createElement('span');
            statNameSpan.classList.add('stat-name');
            statNameSpan.textContent = statName;
            
            const statValueSpan = document.createElement('span');
            statValueSpan.classList.add('stat-value');
            statValueSpan.textContent = statValue;
            
            statDiv.appendChild(statNameSpan);
            statDiv.appendChild(statValueSpan);
            pokemonStats.appendChild(statDiv);
        }
        
        showPokemonCard();
    }
    
    // Funciones de utilidad para mostrar/ocultar elementos
    function showLoading() {
        loading.classList.remove('hidden');
    }
    
    function hideLoading() {
        loading.classList.add('hidden');
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
    
    function hideError() {
        errorMessage.classList.add('hidden');
    }
    
    function showPokemonCard() {
        pokemonCard.classList.remove('hidden');
    }
    
    function hidePokemonCard() {
        pokemonCard.classList.add('hidden');
    }
    
    // Event listeners
    searchBtn.addEventListener('click', searchPokemon);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchPokemon();
        }
    });
});