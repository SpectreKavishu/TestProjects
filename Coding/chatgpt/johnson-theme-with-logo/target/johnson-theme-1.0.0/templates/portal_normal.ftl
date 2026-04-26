<!DOCTYPE html>
<html lang="en">
<head>
    <title>Johnson&Johnson - ${themeDisplay.getLayout().getName(locale)}</title>
    <link rel="stylesheet" href="${themeDisplay.getPathThemeCss()}/custom.css" />
</head>
<body>
<header>
    <img src="${themeDisplay.getPathThemeImages()}/logo.png" alt="Johnson&Johnson Logo" height="50"/>
    <h1>Welcome to Johnson&Johnson Liferay Portal</h1>
</header>

<main>
    <@liferay_portlet["runtime"] portletName="com_liferay_site_navigation_menu_web_portlet_SiteNavigationMenuPortlet" />
    <@liferay_util["include"] page=themeDisplay.getLayoutTemplate().getContent() />
</main>

<footer>
    <p>&copy; Johnson&Johnson</p>
</footer>
</body>
</html>
