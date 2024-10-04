async function load() {
    let url = 'https://api.github.com/users?per_page=8';
    let json = null;
    
    try {
        json = await (await fetch(url)).json();
    } catch(e) {
        console.log('An error occur while fletching..');
    }
    if (!json) return;

    let usersData;
    json.forEach(element => {
        usersData = [{
            avatar: json[element].avatar_url || 'https://api.dicebear.com/9.x/lorelei/png',
            username: json[element].login || 'No name',
            description: 'No description available'
        }]
    });
    delete json;

    console.log(usersData);
}

load();