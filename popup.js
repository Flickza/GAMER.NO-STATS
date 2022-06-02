
const pathname = window.location.pathname.split("/");
const username = pathname[2];
const user_id = pathname[3];

$.getJSON(`https://www.gamer.no/api/paradise/user/${user_id}/matches/maps`, (data) => {
    const first_page = 1;
    const last_page = data.last_page;
    let userData = [];
    for (let i = first_page; i < last_page; i++) {
        userData.push(getUserData(user_id, i));
    }
    Promise.all(userData).then((values) => {
        console.log(values);
    });
});

const getUserData = (id, page) => {
    return $.getJSON(`https://www.gamer.no/api/paradise/user/${id}/matches/maps?page=${page}`, (data) => { return data });
}

