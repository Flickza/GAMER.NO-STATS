const getUserData = async (id, page) => {
    return await $.getJSON(`https://www.gamer.no/api/paradise/user/${id}/matches/maps?page=${page}`, (data) => {
        return data;
    });
}

const getObjectUser = (id) => {
    $.getJSON(`https://www.gamer.no/api/paradise/user/${id}/matches/maps`, async (data) => {
        const first_page = 1;
        let last_page = data.last_page;
        let tableObject = [];
        let userData = [];

        for (let i = first_page; i < last_page + 1; i++) {
            userData.push(getUserData(id, i));
        }
        Promise.all(userData).then((values) => {
            values.map(data => data.data).forEach(data => {
                data.forEach(match => {
                    let map = match.map.resource.name;
                    let kills = match.kills;
                    let deaths = match.deaths;
                    let adr = match.adr;
                    let rating = match.rating;
                    if (!tableObject.hasOwnProperty(map)) {
                        tableObject[map] = {
                            kills: 0,
                            deaths: 0,
                            adr: 0,
                            rating: 0,
                            gamesTracked: 0
                        }
                    }
                    tableObject[`${map}`].gamesTracked += 1;
                    tableObject[`${map}`].kills += kills;
                    tableObject[`${map}`].deaths += deaths;
                    tableObject[`${map}`].adr += parseFloat(adr);
                    tableObject[`${map}`].rating += parseFloat(rating);
                });
            });

            Promise.all(Object.keys(tableObject).map(key => {
                return {
                    map: key,
                    kills: tableObject[key].kills,
                    deaths: tableObject[key].deaths,
                    kd: tableObject[key].kills / tableObject[key].deaths,
                    adr: tableObject[key].adr / tableObject[key].gamesTracked,
                    rating: tableObject[key].rating / tableObject[key].gamesTracked,
                    gamesTracked: tableObject[key].gamesTracked
                }
            })).then(data => {
                data.sort((a, b) => {
                    return b.rating - a.rating;
                });
                $("#table-body").empty();
                data.forEach(match => {
                    $('#table-body').append(`
                        <tr>
                            <td>${match.map}</td>
                            <td>${match.kills}</td>
                            <td>${match.deaths}</td>
                            <td>${match.kd.toFixed(2)}</td>
                            <td>${match.adr.toFixed(2)}</td>
                            <td>${match.rating.toFixed(2)}</td>
                            <td>${match.gamesTracked}</td>
                        </tr>
                        `);
                });
            });
        });
    })
}

const main = () => {
    let pathname = window.location.pathname.split("/");
    if (pathname[1] === "brukere" && pathname[4] === "statistikk") {
        const username = pathname[2];
        const user_id = pathname[3];

        if (username && user_id) {
            $(".user-profile div.mb-4 div.bg-light").html(`
            <table id="table" class="table table-custom table-hover">
                <thead>
                    <tr>
                        <th scope="col">Map</th>
                        <th scope="col">Kills</th>
                        <th scope="col">Deaths</th>
                        <th scope="col">K/D</th>
                        <th scope="col">ADR</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Games</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                    <tr>
                        <td>LOADING...</td>
                        <td>LOADING...</td>
                        <td>LOADING...</td>
                        <td>LOADING...</td>
                        <td>LOADING...</td>
                        <td>LOADING...</td>
                        <td>LOADING...</td>
                    </tr>
                </tbody>
            </table>
            <h4>Made by <a href="https://github.com/Flickza">Flickza</a></h4>`);
            getObjectUser(user_id);
        }
    }
}

main();

$(document.body).on('click', 'a', () => {
    setTimeout(() => {
        main();
    }, 2000);
});