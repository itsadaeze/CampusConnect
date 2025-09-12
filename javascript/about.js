fetch('/data/aboutevent.json')
.then(responds => responds.json())
.then(data => {
    console.log(data);
})
.catch(error => console.error('error loading events:', error));