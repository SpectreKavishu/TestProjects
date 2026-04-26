<#assign
    portlet_display = portletDisplay

    portlet_id = htmlUtil.escapeAttribute(portlet_display.getId())
    portlet_title = htmlUtil.escape(portlet_display.getTitle())
    portlet_css_class = "portlet"

    portlet_decorator_css_class = portlet_display.getPortletDecoratorCssClass()
/>

<#if portlet_decorator_css_class?? && portlet_decorator_css_class != "">
    <#assign portlet_css_class = portlet_css_class + " " + portlet_decorator_css_class />
</#if>

<section class="${portlet_css_class}" id="portlet_${portlet_id}">
    <#if portlet_display.isShowPortletTitleText()>
        <header class="portlet-topper">
            <div class="portlet-title-default">
                <span class="portlet-name-text">${portlet_title}</span>
            </div>
            <div class="portlet-topper-toolbar">
                <@liferay.portlet_icons />
            </div>
        </header>
    </#if>

    <div class="portlet-content">
        <div class="portlet-content-container">
            ${portlet_display.writeContent(writer)}
        </div>
    </div>
</section>