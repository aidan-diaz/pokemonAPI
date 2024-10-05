document.querySelector('button').addEventListener('click', pokemonInfo)

function pokemonInfo() {
    let inputtedName = document.querySelector('input').value.toLowerCase().trim().split(' ').join('-')

    fetch(`https://pokeapi.co/api/v2/pokemon/${inputtedName}`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
        console.log(data)

        const pokemonName = data.species.name

        const properName = nameFormat(pokemonName)

        const type1 = data.types[0].type.name[0].toUpperCase() + data.types[0].type.name.slice(1)
        // try turning type1 and type2 into functions
        const type2 = data.types.length > 1 ? data.types[1].type.name[0].toUpperCase() + data.types[1].type.name.slice(1) : ''
        //if pokedex number is correct, assign it as is
        //if incorrect, take correct one from species url and display it
        const pokedexNumber = data.id < 1500 ?  data.id : data.species.url.slice(-4, -1).split('').filter(number => number == Number(number)).join('')

        const ability1 = data.abilities[0].ability
        //capitalize names and remove hyphens
        const ability1Name = nameFormat(ability1.name)
        const ability2 = data.abilities[1] ? data.abilities[1].ability : '' 
        //accounts for Pokemon with only one ability, such as legendaries or mythicals
        const ability2Name = ability2 ? nameFormat(ability2.name) : ''
        //capitalize names and remove hyphens
        const ability3 = data.abilities[2] ? data.abilities[2].ability : ''
        //capitalize names and remove hyphens
        const ability3Name = ability3 ? nameFormat(ability3.name) : ''
        
        updateDOM(properName, data.sprites, type1, type2, pokedexNumber)
        //display abilities
        displayAbilities(ability1Name,ability2Name,ability3Name)

        playCry(data)
    })
    .catch(err => {
        console.log(`error ${err}`)
    });
}

// capitalize name properly
// keep hyphen for names that should include it
// keep spaces for names that should include it
function nameFormat(name) {
    if(name == 'jangmo-o' || name == 'hakamo-o' || name == 'kommo-o') {
        //capitalizes first letter of Pokemon's name
        return name.charAt(0).toUpperCase() + name.slice(1);
    } else if(name == 'ho-oh' 
    || name == 'porygon-z' /* possibly store these names in an array for better looking conditional */
    || name == 'wo-chien' 
    || name == 'chi-yu' 
    || name == 'chien-pao'
    || name == 'ting-lu') {
        //accounts for unique case where pokemon name should retain hyphen, but capitilize first letter of both names
        return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-') 
    } else if(name == 'type-null') {
        //make sure that Type: Null includes the colon
        //join array back into a string with a colon and a space instead of just a colon
        return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(': ')
    } else if(name == 'nidoran-m' || name == 'nidoran-f') {
        //accounts for these unique cases and returns the name with a male or female symbol accordingly
        return name == 'nidoran-m' ? 'Nidoran&#9794;' : 'Nidoran&#9792;'
    } else if(name == 'mime-jr' || name == 'mr-mime' || name == 'mr-rime') {
        //accounts for these unique cases, where these Pokemon should have a period in their name
        return name == 'mime-jr' ? 'Mime Jr.' : name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('. ') 
    } else if(name == 'farfetchd' || name == 'sirfetchd') {
        //accounts for two unique cases, where an apostrophe should be in the names Farfetch'd and Sirfetch'd
        return name == 'farfetchd' ? "Farfetch'd" : "Sirfetch'd"
    }
    //capitalizes first letter of Pokemon's name
    //removes unnecessary hyphens from names, but adds space(s) if required
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') 
}

function updateDOM(name, sprites, type1, type2, pokedexNumber) {
    //if Pokemon has two types, set value to both types, otherwise only list type1
    const typeDisplay = type2 ? `${type1}/${type2}` : type1
    
    //change h2 to Pokemon's name
    document.querySelector('h2').innerHTML = name
    //Change image to Pokemon's front sprite
    document.querySelector('.frontSprite').src = sprites.front_default
    //Change image to Pokemon's back sprite
    document.querySelector('.backSprite').src = sprites.back_default
    //Change image to Pokemon's shiny front sprite
    document.querySelector('.shinyFrontSprite').src = sprites.front_shiny
    //Change image to Pokemon's shiny back sprite
    document.querySelector('.shinyBackSprite').src = sprites.back_shiny
    //Display Pokemon's type(s)
    document.querySelector('.typesLabel').innerHTML = `Type: <span>${typeDisplay}</span>`
    // document.querySelector('.types').innerHTML = typeDisplay
    //Display Pokemon's Pokedex number
    document.querySelector('.pokedexNumber').innerHTML = `Pokedex #${pokedexNumber}`
}

function displayAbilities(a1,a2,a3) {
    //change h3 to say Abilities:
    document.querySelector('.abilityLabel').innerHTML = 'Abilities:'
    //display ability1
    document.querySelector('.ability1').innerHTML = a1
    //checks unique cases like future paradox Pokemon, where ability1 and ability2 are the same
    //should only display ability1 and not as hidden ability    
    if(a1 != a2) {
        //check to see if a2 exists - do not display it if not
        //if ability2 exists and not ability3, put (Hidden Ability) next to it in DOM
        a2 && !a3 ? document.querySelector('.ability2').innerHTML = `${a2} (Hidden Ability)` : document.querySelector('.ability2').innerHTML = a2
    }
    //if ability3 does not exist, do not display it
    //if ability3 is hidden ability, put (hidden) next to it in DOM
    a3 ? document.querySelector('.ability3').innerHTML = `${a3} (Hidden Ability)` : document.querySelector('.ability3').innerHTML = ''
}

//IDEAS

// // .info BACKGROUND IMAGES THAT MATCH REGION OF POKEMON
// function regionImage(region) {
//     if(data.id < 152) {
//         document.getElementsByClassName('info').style.backgroundImage='url(images/testImage.png)';
//         } else if(region < 253) {
//         // johto
//         } else if(region < 387) {
//         // hoenn
//         } else if(region < 494) {
//         // sinnoh
//         } else if(region < 650) {
//         // unova
//         } else if(region < 253) {
//         // kalos
//         } else if(region < 722) {
//         // alola
//         } else if(region < 810) {
//         // galar
//         } else {
//         // paldea
//         }
// }

// try and have option to play pokemon cries?
// data.cries.legacy  (video/ogg file)
function playCry(cry) {
    //add cry video player and label to HTML
    document.querySelector('.cries').innerHTML = '<h4>Cry:</h4><video controls><source src="" type="video/ogg"></video>'
    // if legacy cry exists, play it
    // otherwise, play latest cry
    cry.cries.legacy ? document.querySelector('video').src = cry.cries.legacy
    : document.querySelector('source').src = cry.cries.latest
}