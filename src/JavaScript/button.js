const ripple = Array.from(document.querySelectorAll('.ripple'));

ripple.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let x = e.offsetX;
        let y = e.offsetY;
        const newSpan = document.createElement('span');
        newSpan.classList.add(`effect`);
        newSpan.style.top = `${e.offsetY}px`
        newSpan.style.left = `${e.offsetX}px`
        btn.appendChild(newSpan)
        setTimeout(() => {
            newSpan.remove();
        }, 1000)
    });
});