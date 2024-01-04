document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = 'http://localhost:3000/characters';
    const animalList = document.getElementById('animal-list');
    const animalDetails = document.getElementById('animal-details');
    const form = document.getElementById('new-animal-form');

    function fetchAnimals() {
        fetch(baseUrl)
            .then(response => response.json())
            .then(animals => animals.forEach(animal => displayAnimal(animal)))
            .catch(error => console.error('Error:', error));
    }

    function displayAnimal(animal) {
        const animalDiv = document.createElement('div');
        animalDiv.className = 'animal';
        animalDiv.innerHTML = `<h3>${animal.name}</h3>`;
        animalDiv.addEventListener('click', () => showAnimalDetails(animal));
        animalList.appendChild(animalDiv);
    }

    function showAnimalDetails(animal) {
        animalDetails.innerHTML = `
            <div>
                <h2>${animal.name}</h2>
                <img src="${animal.image}" alt="${animal.name}" style="max-width: 200px;">
                <p>Votes: <span id="vote-count-${animal.id}">${animal.votes}</span></p>
                <button onclick="voteForAnimal(${animal.id})">Vote</button>
            </div>
        `;
    }

    function addNewAnimal(name, image) {
        fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, image, votes: 0 })
        })
        .then(response => response.json())
        .then(newAnimal => displayAnimal(newAnimal))
        .catch(error => console.error('Error:', error));
    }

    window.voteForAnimal = function(id) {
        const votesElement = document.getElementById(`vote-count-${id}`);
        let newVotes = parseInt(votesElement.textContent) + 1;
        votesElement.textContent = newVotes;

        fetch(`${baseUrl}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ votes: newVotes })
        })
        .then(response => response.json())
        .then(updatedAnimal => console.log('Vote updated for:', updatedAnimal.name))
        .catch(error => console.error('Error:', error));
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const newName = document.getElementById('new-animal-name').value;
        const newImage = document.getElementById('new-animal-image').value;
        addNewAnimal(newName, newImage);
        form.reset();
    });

    fetchAnimals();
});
