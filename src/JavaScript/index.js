const input = document.getElementById('input');
const btnSearch = document.getElementById('btnSearch');
const form = document.getElementById('form');
const cards = document.querySelector('.cards');
const overlay = document.querySelector('.overlay')
const xIcon = document.querySelector('.x-icon')
const toggleOverflow = document.querySelector('.toggleOverflow');
const api = {
    url: 'https://www.balldontlie.io/api/v1/players',
    url2: 'https://www.balldontlie.io/api/v1/season_averages'
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    if(input.value.trim() == "") {
        let uhoh = `Please enter a player name.`
        throwError(uhoh)
        return;
    }

    fetch(`${api.url}?search=${input.value}`)
    .then(res => res.json())
    .then(data => {
        const newCard = document.createElement('div');
        newCard.setAttribute('id', 'playerCard');
        let playerPos = data.data[0].position;
        let playerHt = data.data[0].height_feet
        let playerWT = data.data[0].weight_pounds
        let playerTeam = data.data[0].team.full_name
        if(playerPos == "") {
            playerPos = `INACTIVE`;
        }
        if(playerHt === null) {
            playerHt = `Not Found`;
        } else {
            playerHt = `${data.data[0].height_feet}'${data.data[0].height_inches}"`
        }
        if(playerWT === null) {
            playerWT = `Not Found`;
        } else {
            playerWT = `${data.data[0].weight_pounds} lbs`
        }
        if(playerTeam === null) {
            playerTeam = `Not Found`;
        }
        newCard.innerHTML = `
        <div class="playerCard_name_pos">
            <h3 id="playerCard_name">${data.data[0].first_name} ${data.data[0].last_name} | <span class="sub-title">${playerPos}</span></h3>
        </div>
        <div class="playerCard_ht_wt">
            <span id="playerCard_height"><span class="sub-title">HEIGHT:</span> ${playerHt}</span>
            <span id="playerCard_weight"><span class="sub-title">WEIGHT:</span> ${playerWT}</span>
        </div>
        <hr>
        <p id="playerCard_team"><span class="sub-title">TEAM:</span> ${playerTeam}</p>
        <button class="ripple" id="playerCard_btn">SEASON AVERAGE</button>`
        const statBtn = newCard.querySelector('#playerCard_btn')
        statBtn.addEventListener('click', (e) => {
            let x = e.offsetX;
            let y = e.offsetY;
            const newSpan = document.createElement('span');
            newSpan.classList.add(`effect`);
            newSpan.style.top = `${e.offsetY}px`
            newSpan.style.left = `${e.offsetX}px`
            statBtn.appendChild(newSpan)
            setTimeout(() => {
                newSpan.remove();
            }, 1000)
        });
        statBtn.addEventListener('click', () => {
            fetch(`${api.url2}?player_ids[]=${data.data[0].id}`)
            .then(res2 => res2.json())
            .then(data1 => {
                overlay.style.display = "block";
                document.body.classList.add('toggleOverflow')
               const newTable = document.createElement('div');
               xIcon.addEventListener('click', closeOverlay);
               newTable.classList.add('table-wrapper');
               window.scrollTo(0,0)
               newTable.innerHTML = `<h4>${data.data[0].first_name} ${data.data[0].last_name} | ${playerPos} | ${data1.data[0].season}-${data1.data[0].season + 1} Season</h4>
               <table id="table" cellspacing="0" cellpadding="0">
                   <tr id="table_row">
                       <th>MIN</th>
                       <th>GP</th>
                       <th>PTS</th>
                       <th>FGA</th>
                       <th>FGM</th>
                       <th>FG%</th>
                       <th>3PA</th>
                       <th>3PM</th>
                       <th>3P%</th>
                       <th>FTA</th>
                       <th>FTM</th>
                       <th>FT%</th>
                   </tr>
                   <tr id="table_row">
                       <td>${data1.data[0].min}</td>
                       <td>${data1.data[0].games_played}</td>
                       <td>${data1.data[0].pts}</td>
                       <td>${data1.data[0].fga}</td>
                       <td>${data1.data[0].fgm}</td>
                       <td>${data1.data[0].fg_pct}</td>
                       <td>${data1.data[0].fg3a}</td>
                       <td>${data1.data[0].fg3m}</td>
                       <td>${data1.data[0].fg3_pct}</td>
                       <td>${data1.data[0].fta}</td>
                       <td>${data1.data[0].ftm}</td>
                       <td>${data1.data[0].ft_pct}</td>
                   </tr>
               </table>`
               document.body.appendChild(newTable);
               overlay.addEventListener('click', closeOverlay);

               function closeOverlay() {
                overlay.style.display = 'none'
                document.body.classList.remove('toggleOverflow')
                newTable.remove();
               }
            })
            .catch(error => {
                let uhoh = `${data.data[0].first_name} was inactive during this season.`
                throwError(uhoh)
                overlay.style.display = 'none'
                document.body.classList.remove('toggleOverflow')
                newTable.remove();
            })
        })
        cards.appendChild(newCard)

        input.value = '';
        input.focus();
    })
    .catch(error => {
        let uhoh = `API could not find " ${input.value} ".`
        throwError(uhoh)
    })
})


function throwError(errVar){
    const newAlert = document.createElement('span');
    newAlert.innerHTML = `${errVar}`;
    newAlert.classList.add(`newAlert`);
    document.body.appendChild(newAlert);

    setTimeout(() => {
        newAlert.remove();
    }, 3000)
}