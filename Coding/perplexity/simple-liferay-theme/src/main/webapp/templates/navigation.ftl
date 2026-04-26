<#assign preferences = freeMarkerPortletPreferences.getPreferences({"portletSetupPortletDecoratorId": "barebone", "destination": "/search"}) />

<div class="navbar-right">
    <!-- Site Navigation -->
    <#if has_navigation && is_setup_complete>
        <button aria-controls="navigation" aria-expanded="false" aria-label="<@liferay.language key="toggle-navigation" />" class="btn btn-monospaced btn-sm navbar-toggle" data-target="#navigationCollapse" data-toggle="liferay-collapse" type="button">
            <span class="sr-only"><@liferay.language key="toggle-navigation" /></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>

        <div class="collapse navbar-collapse" id="navigationCollapse">
            <@liferay.navigation_menu default_preferences=preferences />
        </div>
    </#if>

    <!-- User Personal Bar -->
    <@liferay.user_personal_bar />
</div>