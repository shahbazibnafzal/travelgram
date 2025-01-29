const searchInput = document.querySelector('#search-input')
const searchIcon = document.querySelector('#search-icon')
const searchButton = document.querySelector('#search-button')
const resetButton = document.querySelector('#reset-button')
const recommendationCards = document.querySelector('#recommendation-cards')

const resetRecommendation = () => {
  recommendationCards.innerHTML = ''
}

resetButton.addEventListener('click', () => {
  searchInput.value = ''
  resetRecommendation()
})

const filterData = (travelData, keyword) => {
  const lowerCaseKeyword = keyword.toLowerCase()
  if (lowerCaseKeyword.includes('beach')) {
    return travelData.beaches
  } else if (lowerCaseKeyword.includes('temple')) {
    return travelData.temples
  } else {
    const country = travelData.countries.filter(
      (country) => country.name.toLowerCase() === lowerCaseKeyword
    )
    console.log(country, 'found country')
    return country?.[0].cities || []
  }
}

const fetchTravelRecommendation = async (keyword) => {
  try {
    resetRecommendation()
    const response = await fetch('./travel_recommendation_api.json')
    if (response.status !== 200) throw new Error("Couldn't fetch the data")
    const travelData = await response.json()
    const filteredData = filterData(travelData, keyword)
    console.log(filteredData, 'filteredData')
    if (!filteredData.length)
      recommendationCards.innerText = "Couldn't find any recommendations"
    filteredData.forEach(({ id, name, imageUrl, description }) => {
      // Create card
      const cardContainer = document.createElement('div')
      cardContainer.classList.add('card')
      // Create image
      const imageElement = document.createElement('img')
      imageElement.src = imageUrl
      imageElement.alt = name

      // Create text container
      const textContainer = document.createElement('div')
      textContainer.classList.add('text-container')
      // Create title
      const title = document.createElement('h2')
      title.textContent = name
      // Create a description paragraph
      const placeDescription = document.createElement('p')
      placeDescription.textContent = description
      placeDescription.classList.add('place-description')

      textContainer.appendChild(title)
      textContainer.appendChild(placeDescription)
      // Append the image, heading and description to the container
      cardContainer.appendChild(imageElement)
      cardContainer.appendChild(textContainer)

      recommendationCards.appendChild(cardContainer)
    })
  } catch (error) {
    console.log(error.message)
  }
}

searchButton.addEventListener('click', () => {
  const keyword = searchInput.value
  fetchTravelRecommendation(keyword)
})
