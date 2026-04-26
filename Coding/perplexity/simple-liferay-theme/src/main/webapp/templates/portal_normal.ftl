<!DOCTYPE html>

<#include init />

<html class="${root_css_class}" dir="<@liferay.language key="lang.dir" />" lang="${w3c_language_id}">

<head>
    <title>${html_title}</title>

    <meta content="initial-scale=1.0, width=device-width" name="viewport" />

    <@liferay_util["include"] page=top_head_include />

    <!-- Custom theme CSS -->
    <link rel="stylesheet" href="${css_folder}/custom.css" />
</head>

<body class="${css_class}">

<@liferay_ui["quick-access"] contentId="#main-content" />

<@liferay_util["include"] page=body_top_include />

<@liferay.control_menu />

<div class="container-fluid" id="wrapper">
    <!-- Header -->
    <header id="banner" role="banner">
        <div class="navbar navbar-classic navbar-top py-3">
            <div class="container-fluid max-full user-personal-bar">
                <div class="navbar-header">
                    <#if show_site_name>
                        <a class="${logo_css_class} navbar-brand" href="${site_default_url}" title="<@liferay.language_format arguments="[${site_name}]" key="go-to-x" />">
                            <img alt="${logo_description}" class="logo" height="${site_logo_height}" src="${site_logo}" width="${site_logo_width}" />

                            <#if show_site_name>
                                <span class="site-name" title="<@liferay.language_format arguments="[${site_name}]" key="go-to-x" />">
                                    ${site_name}
                                </span>
                            </#if>
                        </a>
                    </#if>
                </div>

                <#include "${full_templates_path}/navigation.ftl" />
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <section id="content">
        <h1 class="hide-accessible" role="heading" aria-level="1">${the_title}</h1>

        <#if selectable>
            <@liferay_util["include"] page=content_include />
        <#else>
            ${portletDisplay.recycle()}

            ${portletDisplay.setTitle(the_title)}

            <@liferay_theme["wrap-portlet"] page="portlet.ftl">
                <@liferay_util["include"] page=content_include />
            </@>
        </#if>
    </section>

    <!-- Footer -->
    <footer id="footer" role="contentinfo">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <p class="text-center">
                        <@liferay.language key="powered-by" />
                        <a href="http://www.liferay.com" rel="external">Liferay</a>
                    </p>
                </div>
            </div>
        </div>
    </footer>
</div>

<@liferay_util["include"] page=body_bottom_include />

<@liferay_util["include"] page=bottom_include />

<!-- Custom theme JavaScript -->
<script src="${javascript_folder}/main.js"></script>

</body>

</html>