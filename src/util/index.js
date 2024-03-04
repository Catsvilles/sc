import { toasts } from 'svelte-toasts'
const toast = (title, type) => {
	const toast = toasts.add({
		title: title,
		description: '',
		duration: 5000, // 0 or negative to avoid auto-remove
		type: type || 'info',
		theme: 'dark',
		placement: 'top-center',
		showProgress: false,
		onClick: () => {},
		onRemove: () => {},
		// component: BootstrapToast, // allows to override toast component/template per toast
	})
}

function clickOutside(node, onEventFunction) {
   const handleClick = event => {
       var path = event.composedPath();

       if (!path.includes(node)) {
           onEventFunction();
       }
   }

   document.addEventListener("click", handleClick);

   return {
       destroy() {
           document.removeEventListener("click", handleClick);
       }
   }
}
function first(text) {
    if (!text) return text
    return text.substring(0, 1).toUpperCase()
}
function date(value) {
    const date = new Date(value)
    return date.toLocaleString(['en-US'], { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function truncate(text, stop, clamp) {
    if (text)
        return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
    else
        return ""
}
export { clickOutside, first, date, truncate, toast }
