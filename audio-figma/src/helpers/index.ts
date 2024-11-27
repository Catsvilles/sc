const pad = num => num < 10 ? '0' + num : num;

export const mapTrackData = td => {  
  return {
    id: td.id,
    title:  td.data.title,
    slug: td.data.slug,
    desc: td.data.description,
    url: 'https://soundgrape.s3.us-east-2.amazonaws.com/' + td.data.files.preview,
    duration: td.data.duration,
    pcm: td.data.pcm,
    //img: td.img,
    category: td.data.category,
    tags: '',
    isCurrent: false,
    pause: false
  }
};

export const format = time => {
  if (isNaN(time)) return '--:--:--';
  const minutes = Math.floor((time / 60) % 60);
  const seconds = Math.ceil((time % 60));
  return `${pad(minutes)}:${pad(seconds)}`;
};

export const normailezeString = str => str.length ?
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() :
  str;

export function constructURL2(url, fl) {
    url += '?'
    Object.keys(fl).forEach((e) => {
      if (e == 'page') return
      if (fl[e] && fl[e] !== 'undefined' && fl[e].length > 0) url += `${e}=${fl[e]}&`
    })
    return url
  }

export function clickOutside(element, callbackFunction) {
  function onClick(event) {
    if (!element.contains(event.target)) {
      callbackFunction();
    }
  }  
  document.body.addEventListener('click', onClick);
    return {
    update(newCallbackFunction) {
      callbackFunction = newCallbackFunction;
    },
    destroy() {
      document.body.removeEventListener('click', onClick);
    }
  }
}