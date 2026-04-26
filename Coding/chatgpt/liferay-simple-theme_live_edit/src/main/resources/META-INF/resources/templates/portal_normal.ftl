<#include init.ftl>

<!DOCTYPE html>
<html>
<head>
    <title>${company_name} - Simple Theme</title>
    <link rel="stylesheet" href="${themeDisplay.getPathThemeCss()}/custom.css" />
</head>
<body>
    <header>
        <h1>Welcome to ${company_name} Portal</h1>
    </header>
    <main>
        <@liferay_theme["include"] file="navigation.ftl" />
        <div class="content">
            <@liferay_portlet["runtime"] portletName="56" /> 
        </div>
    </main>
    <footer>
        <p>Simple Theme Footer - Hot Deployed</p>
    </footer>
</body>
</html>
