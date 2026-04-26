# Simple Liferay Theme - Maven Project

A simple Maven-based Liferay theme for Liferay Portal 7.3.5 with hot deployment support for IntelliJ IDEA.

## Project Structure

```
simple-liferay-theme/
├── pom.xml                                    # Maven configuration
├── README.md                                  # This file
├── .gitignore                                 # Git ignore rules
├── deploy.bat                                 # Windows deployment script
├── deploy.sh                                  # Linux/Mac deployment script
└── src/
    ├── main/
    │   ├── webapp/
    │   │   ├── css/                          # SCSS files
    │   │   │   ├── _custom.scss             # Main custom styles
    │   │   │   ├── _variables.scss          # SCSS variables
    │   │   │   ├── _mixins.scss             # SCSS mixins
    │   │   │   └── _components.scss         # Component styles
    │   │   ├── images/                       # Theme images
    │   │   ├── js/
    │   │   │   └── main.js                  # Theme JavaScript
    │   │   ├── templates/                    # FreeMarker templates
    │   │   │   ├── portal_normal.ftl        # Main page template
    │   │   │   ├── navigation.ftl           # Navigation template
    │   │   │   ├── init_custom.ftl          # Custom variables
    │   │   │   └── portlet.ftl              # Portlet template
    │   │   └── WEB-INF/
    │   │       ├── liferay-look-and-feel.xml # Theme configuration
    │   │       ├── liferay-plugin-package.properties
    │   │       └── web.xml                   # Web application config
    │   └── resources/
    │       └── resources-importer/
    │           └── sitemap.json             # Sample content import
```

## Prerequisites

- Java 11 or higher
- Maven 3.6+
- Liferay Portal 7.3.5 (Tomcat bundle)
- IntelliJ IDEA (with Liferay plugin)

## Quick Start

### 1. Extract and Setup

1. Extract the ZIP file to your desired location
2. Open terminal/command prompt in the project directory

### 2. Configure Maven Properties

Edit `pom.xml` and update the local development profile paths:

```xml
<profile>
    <id>local-dev</id>
    <properties>
        <liferay.auto.deploy.dir>/path/to/your/liferay/deploy</liferay.auto.deploy.dir>
        <liferay.app.server.deploy.dir>/path/to/your/liferay/tomcat/webapps</liferay.app.server.deploy.dir>
        <liferay.app.server.lib.global.dir>/path/to/your/liferay/tomcat/lib/ext</liferay.app.server.lib.global.dir>
        <liferay.app.server.portal.dir>/path/to/your/liferay/tomcat/webapps/ROOT</liferay.app.server.portal.dir>
    </properties>
</profile>
```

### 3. Build the Project

```bash
mvn clean compile package
```

## IntelliJ IDEA Setup for Hot Deployment

### Step 1: Install Liferay IntelliJ Plugin

1. Go to `File → Settings → Plugins`
2. Search for "Liferay" in the Marketplace tab
3. Install the "Liferay IntelliJ Plugin"
4. Restart IntelliJ IDEA

### Step 2: Import Maven Project

1. Open IntelliJ IDEA
2. Choose `File → Open`
3. Select the `pom.xml` file from your project directory
4. Choose "Open as Project"
5. Wait for Maven to resolve dependencies

### Step 3: Configure Liferay Server

1. Go to `File → Settings → Build, Execution, Deployment → Application Servers`
2. Click `+` and select "Liferay Server"
3. Set the Liferay installation directory (your Liferay bundle root)
4. Configure the following:
   - **Name**: Liferay 7.3.5 Local
   - **Liferay Home**: `/path/to/your/liferay-bundle`
   - **Server Directory**: `/path/to/your/liferay-bundle/tomcat-x.x.x`
   - **Deployments Directory**: `/path/to/your/liferay-bundle/deploy`

### Step 4: Create Run Configuration

1. Go to `Run → Edit Configurations`
2. Click `+` and select "Liferay Server"
3. Configure:
   - **Name**: Liferay Theme Development
   - **Server**: Select your configured Liferay server
   - **VM Options**: Add if needed for debugging
   ```
   -Xmx2048m -XX:MaxMetaspaceSize=512m
   ```

### Step 5: Configure Hot Deployment

1. In your run configuration, go to the **Deployment** tab
2. Click `+` and select "Artifact"
3. Choose `simple-liferay-theme:war exploded`
4. Set **Application context**: `/simple-liferay-theme`

### Step 6: Enable Hot Swap

1. Go to `File → Settings → Build, Execution, Deployment → Debugger → HotSwap`
2. Check all the options:
   - ☑️ Reload classes after compilation: Always
   - ☑️ Reload classes in background
   - ☑️ Enable hot-swap agent

### Step 7: Configure Automatic Build

1. Go to `File → Settings → Build, Execution, Deployment → Compiler`
2. Check ☑️ **Build project automatically**
3. Press `Ctrl+Shift+A` (or `Cmd+Shift+A` on Mac)
4. Search for "Registry"
5. Find and enable: `compiler.automake.allow.when.app.running`

## Development Workflow

### Starting Development Server

1. Run your Liferay configuration: `Run → Run 'Liferay Theme Development'`
2. Wait for Liferay to start completely
3. The theme will be automatically deployed

### Hot Deployment Process

1. **For CSS/SCSS changes**:
   - Edit files in `src/main/webapp/css/`
   - Save the file
   - IntelliJ will automatically recompile and redeploy
   - Refresh your browser to see changes

2. **For Template changes**:
   - Edit files in `src/main/webapp/templates/`
   - Save the file
   - Changes are deployed automatically
   - Refresh browser to see changes

3. **For JavaScript changes**:
   - Edit `src/main/webapp/js/main.js`
   - Save the file
   - Clear browser cache and refresh

### Manual Deployment

If automatic deployment doesn't work:

```bash
# From project root
mvn clean package

# Copy the generated WAR to Liferay deploy directory
cp target/simple-liferay-theme-1.0.0.war /path/to/liferay/deploy/
```

### Using Deployment Scripts

```bash
# Linux/Mac
./deploy.sh

# Windows
deploy.bat
```

### Using Maven Commands

```bash
# Clean and compile
mvn clean compile

# Package theme
mvn package

# Deploy to local Liferay (if paths configured)
mvn clean package -Plocal-dev
```

## Theme Features

### Customization Options

The theme includes configurable settings available in the Control Panel:

1. **Show Site Name**: Toggle site name visibility
2. **Theme Color**: Customize primary theme color
3. **Color Schemes**: Blue (default) and Green variations

### Responsive Design

- Mobile-first responsive design
- Bootstrap-compatible grid system
- Touch-friendly navigation

### SCSS Architecture

- Modular SCSS structure
- Variables for easy customization
- Mixins for reusable styles
- Component-based organization

## Troubleshooting

### Common Issues

1. **Theme not deploying**:
   - Check Liferay server logs
   - Verify deployment paths in `pom.xml`
   - Ensure Liferay server is running

2. **CSS changes not reflecting**:
   - Clear browser cache
   - Check if SCSS compilation is successful
   - Verify CSS Builder plugin configuration

3. **Hot deployment not working**:
   - Ensure IntelliJ automatic build is enabled
   - Check if `compiler.automake.allow.when.app.running` is enabled
   - Verify artifact configuration in run settings

### Debug Mode

To run in debug mode for troubleshooting:

1. Use "Debug" instead of "Run" in IntelliJ
2. Set breakpoints in your theme code
3. Access your site to trigger breakpoints

### Log Files

Monitor these log files for issues:

```
/path/to/liferay/logs/liferay.log
/path/to/liferay/tomcat/logs/catalina.out
```

## Customization Guide

### Adding New Styles

1. Edit `src/main/webapp/css/_custom.scss`
2. Use variables from `_variables.scss`
3. Save and let auto-compilation handle the rest

### Modifying Templates

1. Edit FreeMarker templates in `src/main/webapp/templates/`
2. Use Liferay's template variables and macros
3. Test changes in development

### Adding JavaScript Features

1. Edit `src/main/webapp/js/main.js`
2. Use the `SimpleTheme` namespace
3. Hook into Liferay's portlet lifecycle events

## Production Deployment

For production deployment:

1. Build the final WAR:
   ```bash
   mvn clean package -Dmaven.test.skip=true
   ```

2. Deploy the WAR file:
   ```bash
   cp target/simple-liferay-theme-1.0.0.war /path/to/production/liferay/deploy/
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

1. Check the Liferay documentation
2. Review IntelliJ IDEA Liferay plugin documentation
3. Check project issues on GitHub
