// JavaScript script to load users from the GitHub API and display them in a Swiper slider
// 4 Oct. 2024
// Authors: Jeremy Roussy & Kévin Bénard

const card = document.querySelector(".blog-slider__wrp.swiper-wrapper");
card.classList.add('hidden');
load();
/**
 * Asynchronous function to load users from the GitHub API.
 * It fetches 8 users and displays them in a slider interface.
 * If an error occurs during data fetching, an error message is displayed in the UI.
 */
async function load() {
    // GitHub API URL to fetch users
    let url = 'https://api.github.com/users?per_page=20000';
    let userList = null;
    
    try {
        // Sending a request to the API
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        userList = await response.json();

    } catch(e) {
        // If an error occurs during the request, log the error in the console and display an error message in the UI
        console.error('An error occurred while fetching data:', e);
        card.classList.remove('hidden');
        card.textContent = "Failed to load users.";
        return;
    }
    
    if (!userList || userList.length === 0) {
        console.error('No users found.');
        return;
    }

    // Select a random user from the list
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * userList.length);
        const user = userList.splice(randomIndex, 1)[0];

        await fetchUserDetails(user.login);
    }

    card.classList.remove('hidden');
    initSwiper();

}

/**
 * Asynchronous function to fetch additional details for a user, including bio.
 * It calls `createUser` after retrieving the bio.
 *
 * @param {string} username - GitHub username
 */
async function fetchUserDetails(username) {
    let userDetailsUrl = `https://api.github.com/users/${username}`;
    let user = null;

    try {
        // Sending a request to the user-specific API endpoint to get detailed info
        const response = await fetch(userDetailsUrl);
        if (!response.ok) throw new Error(`HTTP error fetching user details for ${username}`);
        user = await response.json();

    } catch (e) {
        // Log the error and fallback to a default message if bio is not available
        console.error(`Failed to fetch bio for ${username}:`, e);
    }

    const avatar = user && user.avatar_url ? user.avatar_url : '...';
    const bio = user && user.bio ? user.bio : 'No bio available...';

    createUser(username, avatar, bio);
}

/**
 * Create a user card with avatar, username, and description.
 * The card is appended to the slider container in the DOM.
 *
 * @param {string} username - GitHub username
 * @param {string} avatar - URL of the user's avatar image
 * @param {string} description - User's description (currently set to a static value)
 */
function createUser(username, avatar, description) {
    // Get the wrapper container for the slider
    const wrapper = document.querySelector(".blog-slider__wrp.swiper-wrapper");
    if (!wrapper) {
        console.error("Slider wrapper not found!");
        return;
    }

    // Create the necessary DOM elements for the user card
    const item_container = document.createElement("div");
    item_container.classList.add("blog-slider__item", "swiper-slide");

    const img_container = document.createElement("div");
    img_container.classList.add("blog-slider__img");
    
    const img = document.createElement("img");
    img.src = avatar;

    const content_container = document.createElement("div");
    content_container.classList.add("blog-slider__content");

    const content_title = document.createElement("div");
    content_title.classList.add("blog-slider__title");
    const title = document.createTextNode(username);

    const content_text = document.createElement("div");
    content_text.classList.add("blog-slider__text");
    const text = document.createTextNode(description);

    // Append the elements to build the card structure
    img_container.appendChild(img);
    content_text.appendChild(text);
    content_title.appendChild(title)

    content_container.append(content_title, content_text);
    item_container.append(img_container, content_container);

    wrapper.appendChild(item_container);
}

/**
 * Function to initialize the Swiper slider with specific configuration.
 * It sets parameters such as the slide effect, loop behavior, and pagination.
 */
function initSwiper() {
    new Swiper(".blog-slider", {
        spaceBetween: 30, // Space between each slide
        effect: "fade", // Fading effect between slides
        loop: true, // Enable continuous loop mode
        mousewheel: {
            invert: false, // Normal mouse wheel scrolling
        },
        pagination: {
            el: ".blog-slider__pagination", // Pagination element
            clickable: true, // Allow pagination buttons to be clickable
        },
    });
}