$(document).ready(function () {

    // toggle menu
    $('.section-header .btn-toggle_menu').click(function (data) {
        var menuList = []
        $('.section-header .header-navigation__list li').each(function () {
            var menuItem = $(this).find('a').text();
            var menuItemAttr = $(this).find('a').attr('href');
            menuList.push({name: menuItem, attr: menuItemAttr});
        });

   var html = `
        <div class="mobile-navigation">
            <div class="container-row">
                <nav class="mobile-navigation-container">
                    <ul class="mobile-navigation__list">`;
                    for (var i in menuList) {
                        html += `<li class="mobile-navigation__item"><a href="`+menuList[i].attr+`" class="mobile-navigation__link">`+menuList[i].name+`</a></li>`
                    }
