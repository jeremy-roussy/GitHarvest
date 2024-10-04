async function load() {
    let url = 'https://api.github.com/users?per_page=8';
    let json = null;

    
    try {
        json = await (await fetch(url)).json();
    } catch(e) {
        console.log('An error occur while fletching..');
    }
    
    if (!json) return;
    
    console.log(json);

    json.forEach(element => {
        // usersData = [{
        //     avatar: element.avatar_url || 'https://api.dicebear.com/9.x/lorelei/png',
        //     username: element.login || 'No name',
        //     description: 'No description available'
        // }]
        createUser(element.avatar_url, element.login, 'No description available');
    });

    delete json;
}

load();

function createUser(avatar, username, description) {

    // Create elements with their classes and contents
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

    // Add elements to their parents
    img_container.appendChild(img);
    
    content_text.appendChild(text);
    content_title.appendChild(title)
    content_container.appendChild(content_title);
    content_container.appendChild(content_text);

    item_container.appendChild(img_container);
    item_container.appendChild(content_container);

    document.querySelector(".blog-slider__wrp.swiper-wrapper").appendChild(item_container);

    let swiper = new Swiper(".blog-slider", {
        spaceBetween: 30,
        effect: "fade",
        loop: true,
        mousewheel: {
            invert: false,
        },
        // autoHeight: true,
        pagination: {
            el: ".blog-slider__pagination",
            clickable: true,
        },
    });
}