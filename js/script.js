$(document).ready(function () {

    // toggle menu
    $('.section-header .btn-toggle_menu').click(function (data) {
        var menuList = []
        $('.section-header .header-navigation__list li').each(function () {
            var menuItem = $(this).find('a').text();
            var menuItemAttr = $(this).find('a').attr('href');
            menuList.push({name: menuItem, attr: menuItemAttr});
        });

