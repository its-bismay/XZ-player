let currentSong = new Audio
let song;
let currfolder;


let prev = document.querySelector("#prev")
let next = document.querySelector("#next")



const main = async(folder) => {
    console.log(typeof(folder));
    currfolder = folder;
    const response = await fetch(`http://127.0.0.1:5500/songs/${folder}/`)
    const result = await response.text();
    let element = document.createElement("element")
    element.innerHTML = result
    let as = element.getElementsByTagName("a")
    song = []
    for(let index = 0; index < as.length; index++){
        const el = as[index]
        if(el.href.endsWith(".mp3")){
            song.push(el.href.split(`/${folder}/`)[1])
        }
    }
    
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const songs of song) {
        songul.innerHTML = songul.innerHTML + `
        <li>
        <div class="random">
            <i class='bx bxs-music'></i>
            <div class="information">
                <div>${songs.replaceAll("%20"," ")}</div>
                <div class="newT">${decodeURIComponent(folder)}</div>
            </div>
        </div>
        <div class="playn">
            <span>Play Now</span>
            <i class='bx bx-play-circle' ></i>
        </div>
    </li>`
    }

    //attach an event listner to all the list songs
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", objs => {
            playMusic(e.querySelector(".information").firstElementChild.innerHTML.trim())
        })
        
    })

    return song;
}

function formatTime(totalSeconds) {
    // Convert to integer to remove decimals
    let seconds = Math.floor(totalSeconds);

    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}


const playMusic = (track, pause=false) => {
    currentSong.src = `/songs/${currfolder}/` + track
    if(!pause){
        currentSong.play();
        play.classList.remove('bx', 'bx-play-circle')
        play.classList.add('bx', 'bx-pause-circle')
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function displayAlbum(){
    const response = await fetch(`http://127.0.0.1:5500/songs/`)
    const result = await response.text();
    let element = document.createElement("element")
    element.innerHTML = result
    let anchors = element.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardbox")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/songs/")){
            // console.log(e.href)
            let folder = (e.href.split("/").slice(-2)[1])
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json();
            // console.log(response)
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div class="card" data-folder = "${folder}">
            <div class="playbtn">
              <i class="bx bx-play"></i>
            </div>
            <img src="/songs/${folder}/cover.webp" alt="cover image" />
            <h3>${response.name}</h3>
            <p>${response.description}</p>
          </div>`

        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e=> {
        e.addEventListener("click", async (item) => {
            song = await main(`${item.currentTarget.dataset.folder}`)
            playMusic(song[0])
        })
    })
}

const getsongs = async() => {

    await main("AMAN");
    playMusic(song[0], true)

    //play all the play lists
    displayAlbum()

    //attach event listners to playbtns
    play.addEventListener("click", () => {
        if(currentSong.paused){
            currentSong.play()
            play.classList.remove('bx', 'bx-play-circle')
            play.classList.add('bx', 'bx-pause-circle')
        }
        else{
            currentSong.pause()
            play.classList.remove('bx', 'bx-pause-circle')
            play.classList.add('bx', 'bx-play-circle')
        }
    })

    //listen for timeupdates
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML =`${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = `${percent}%`
        currentSong.currentTime = ((currentSong.duration) * percent)/100
    })

    // hamburger menu
    document.querySelector(".bx-menu").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".bx-x-circle").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-380px"
    })

    prev.addEventListener("click", () => {
        currentSong.pause()
        let index = song.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index-1) >= 0){
            playMusic(song[index-1])
        }
    })

    next.addEventListener("click", () => {
        currentSong.pause()
        let index = song.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index+1) < song.length){
            playMusic(song[index+1])
        }
    })


}

getsongs();




