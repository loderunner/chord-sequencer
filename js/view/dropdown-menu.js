const onClickMenu = function(e) {
        const menu = e.currentTarget;
        if (menu.classList.contains('open')) {
            menu.classList.remove('open');
        } else {
            e.stopPropagation();
            menu.classList.add('open');
            document.addEventListener('click', function(e) {
                    menu.classList.remove('open');
                },
                {once : true}
            );
        }
}

const onClickItem = function(e) {
    const item = e.currentTarget;
    const selectEvent = new Event('select', {bubbles: true});
    item.dispatchEvent(selectEvent);
}

module.exports = function(target) {
    target.classList.add('dropdown-menu');
    target.addEventListener('click', onClickMenu);
    const items = target.querySelectorAll('ul>li');
    for (item of items) {
        item.addEventListener('click', onClickItem);
    }
}