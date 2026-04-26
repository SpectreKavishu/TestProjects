<#--
This file allows you to override the default init.ftl definitions.
Include custom theme variables and settings here.
-->

<#-- Theme settings variables -->
<#assign show_site_name = getterUtil.getBoolean(themeDisplay.getThemeSetting("show-site-name")) />
<#assign theme_color = getterUtil.getString(themeDisplay.getThemeSetting("theme-color")) />

<#-- Custom CSS classes -->
<#assign css_class = css_class + " simple-theme" />

<#-- Custom JavaScript variables -->
<#assign javascript_folder = "/js" />
<#assign css_folder = "/css" />

<#-- Additional theme variables -->
<#assign site_logo_width = "auto" />
<#assign site_logo_height = "56" />