const mainWrapper = document.querySelector(".linksGenerated");
const alert = document.querySelector(".alert-placeholder");
const submit = document.getElementById("submit");

window.onload = displayLinks()

function createLink() {
  const input = document.querySelector(".userlink");

  if ((input.value.trim() && input.value) == "") {
    alert.innerHTML = `<div class="alert alert-danger alert-dismissible mt-3" role="alert">
      <div>Please add a link</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  } else {
    const urlchecked = localStorage.getItem("urlShortened")
      ? JSON.parse(localStorage.getItem("urlShortened"))
      : [];
    const url = `https://api.shrtco.de/v2/shorten?url=${input.value}`;
    axios(url)
      .then((Response) => {
        const value = {
          linkChanged: Response.data.result.original_link,
          linkGenerated: Response.data.result.full_short_link,
        };
        urlchecked.unshift(value);
        localStorage.setItem("urlShortened", JSON.stringify(urlchecked));
        displayLinks()
        input.value = ''
      })
      .catch((err) => {
        alert.innerHTML = `<div class="alert alert-danger alert-dismissible mt-3" role="alert">
      <div>Please input a Valid Link</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
      });
  }
}

submit.addEventListener("click", (e) => {
  e.preventDefault();
  createLink();
});

function displayLinks(){
  mainWrapper.innerHTML = ''
  const links = localStorage.getItem("urlShortened")
  ? JSON.parse(localStorage.getItem("urlShortened"))
  : [];
  if(links.length !== 0){
    links.forEach(ele => linkShown(ele.linkChanged, ele.linkGenerated))
  } 
}

function linkShown(linkChanged, linkGenerated) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("links");
  const paragraph = document.createElement("p");
  paragraph.textContent = linkChanged;
  wrapper.appendChild(paragraph);
  const copySection = document.createElement("div");
  const newlink = document.createElement("a");
  newlink.classList.add("newLink");
  newlink.textContent = linkGenerated;
  copySection.appendChild(newlink);
  const copyBtn = document.createElement("a");
  copyBtn.addEventListener('click', copyText);
  copyBtn.classList.add("copy");
  copyBtn.classList.add("btn");
  copyBtn.classList.add("btn-info");
  copyBtn.textContent = "Copy";
  copySection.appendChild(copyBtn);
  wrapper.appendChild(copySection);
  mainWrapper.appendChild(wrapper);
}

function copyText(e){
  const textElement = document.querySelector('.newLink')
  navigator.clipboard.writeText(textElement.textContent).then(()=> {
    e.target.classList.remove('btn-info')
    e.target.classList.add('btn-dark')
    e.target.textContent = 'Copied!'
    setInterval(() => {
      e.target.classList.remove('btn-dark')
      e.target.classList.add('btn-info')
      e.target.textContent = 'Copy!'
    },1000)
  }).catch(err => console.log(err))
}