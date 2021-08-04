// mobile menu
const hamburger = document.querySelector('.hamburger');
const menu =  document.querySelector('.menu');

const toggleMenu = () => { 
    menu.classList.toggle('open');    
}

hamburger.addEventListener('click' , toggleMenu);

// url shortening

const formContainer = document.querySelector('.shorten');
const linksContainer = document.querySelector('.links-container');
const form = document.querySelector('form');
const input = document.querySelector('.link');

// save results to local storage
const results = JSON.parse(localStorage.getItem('results') ) || []; 
document.addEventListener('DOMContentLoaded' , displayResultsOnload);

function displayResultsOnload(){ 
    results.forEach(result => { 
        const resultsContainer = document.createElement('div');
        resultsContainer.classList.add('result');
        resultsContainer.innerHTML = result;
        linksContainer.append(resultsContainer);
    });
}

form.addEventListener('submit' , e => { 
    e.preventDefault();
    const url = input.value;
    form.reset();
    shortenUrlAndDiplayResult(url);
})

async function shorten(url){ 
    const request = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
    const data = await request.json();
    const result = data.result;

    return new Promise((resolve , reject) => { 
        resolve(result.full_share_link);
    })
}

function displayData(originalUrl , shortenedUrl){ 
    const html = `<div class="result">
    <p class="url">${originalUrl}</p>
    <p class="url--shortend">${shortenedUrl}</p>
    <button class="btn">copy</button></div>`;

    linksContainer.innerHTML += html;
    const result = linksContainer.querySelector('.result');

    results.push(result.innerHTML);
    localStorage.setItem('results' , JSON.stringify(results));
}

async function shortenUrlAndDiplayResult(url){ 
    try{ 
        const result = await shorten(url);
        displayData(url , result);
    }
    catch{ 
        handleError();
    }
}

function handleError(){ 
    input.style.border = '3px solid hsl(0, 87%, 67%)';
    const errorMsg = document.createElement('p');
    errorMsg.classList.add('error');
    errorMsg.textContent = 'Please enter a valid url'
    form.append(errorMsg);
    setTimeout(() => { 
        errorMsg.remove();
        input.style.border = 'initial';
    },2000)
}

// copy button functionality

const darkViolet = 'hsl(257, 27%, 26%)';
const cyan = 'hsl(180, 66%, 49%)';
linksContainer.addEventListener('click' , copyUrl);

function copyUrl(event){
    const copyBtn = event.target.closest('.btn');
    if(!copyBtn) return; 

    const container = copyBtn.parentElement;
    const text = container.querySelector('.url--shortend');

    navigator.clipboard.writeText(text.textContent)
    .then(() => { 
        updateCopyBtn(copyBtn);
    })
}

function updateCopyBtn(btn){ 
    btn.textContent = 'copied!';
    btn.style.backgroundColor = darkViolet ;
    setTimeout(() =>{ 
        btn.textContent = 'copy';
        btn.style.backgroundColor = cyan;
    } , 2000)
}