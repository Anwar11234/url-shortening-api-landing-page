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
document.addEventListener('DOMContentLoaded' , displayResults);

function displayResults(){ 
    results.forEach(result => { 
        const resultsContainer = makeElement('div' , '' , 'result');
        resultsContainer.innerHTML = result;
        linksContainer.append(resultsContainer);
    });
}

form.addEventListener('submit' , e => { 
    e.preventDefault();
    const url = input.value;
    input.value = '';
    shorten(url)
        .then(result => { 
            displayData(url , result);
        })
        .catch(() => { 
            input.style.border = '3px solid hsl(0, 87%, 67%)';
            const errorMsg = makeElement('p' , 'Please Enter a valid url' , 'error');
            form.append(errorMsg);
            setTimeout(() => { 
                errorMsg.remove();
                input.style.border = 'initial';
            },2000)
        })
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
   const url = makeElement('p' , originalUrl , 'url');
   const result = makeElement('p' , shortenedUrl, 'url--shortend');
   const btn = makeElement('button' , 'copy' , 'btn' );
   const parentDiv = makeElement('div','' , 'result' , url , result , btn);
   linksContainer.append(parentDiv);
   results.push(parentDiv.innerHTML);
   localStorage.setItem('results' , JSON.stringify(results));

}

function makeElement(tag ,text = '' , className , ...children){ 
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className;
    element.append(...children);
    return element;
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
    navigator.clipboard.writeText(text.textContent).then(() => { 
        copyBtn.textContent = 'copied!';
        copyBtn.style.backgroundColor = darkViolet ;
        setTimeout(() =>{ 
            copyBtn.textContent = 'copy';
            copyBtn.style.backgroundColor = cyan;
        } , 2000)
    })
}