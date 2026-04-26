# Sample Liferay Theme

A simple theme project for Liferay 7.3.5 with hot deployment support.

## Project Structure

```
sample-liferay-theme/
├── pom.xml                                    # Maven configuration
├── src/
│   └── main/
│       └── webapp/
│           ├── css/
│           │   └── main.css                   # Main theme styles
│           ├── js/
│           │   └── main.js                    # Theme JavaScript
│           ├── templates/
│           │   ├── portal_normal.ftl          # Main page template
│           │   ├── init.ftl                   # Template initialization
│           │   └── navigation.ftl             # Navigation template
│           ├── images/                        # Theme images directory
│           └── WEB-INF/
│               ├── web.xml                    # Web application descriptor
│               ├── liferay-look-and-feel.xml  # Theme configuration
│               └── liferay-plugin-package.properties
```

## How to Use

1. **Import into IntelliJ IDEA:**
   - Extract the ZIP file
   - Open IntelliJ IDEA
   - File → Open → Select the `sample-liferay-theme` folder
   - IntelliJ will automatically detect it as a Maven project

2. **Build the Project:**
   ```bash
   mvn clean package
   ```

3. **Deploy to Liferay:**
   - Copy the generated WAR file from `target/sample-liferay-theme.war` to your Liferay's `deploy` folder
   - Or use hot deployment in IntelliJ if configured

4. **Apply the Theme:**
   - Go to Liferay Portal → Site Administration → Site Builder → Pages
   - Select a page → Configure → Look and Feel
   - Select "Sample Theme" from the theme dropdown

## Features

- Responsive design
- Clean, modern styling
- Navigation support with dropdown menus
- Mobile-friendly layout
- Smooth scrolling navigation
- FreeMarker (FTL) templates
- Custom CSS and JavaScript

## Customization

- **Styling:** Edit `src/main/webapp/css/main.css`
- **Behavior:** Edit `src/main/webapp/js/main.js`
- **Templates:** Modify FTL files in `src/main/webapp/templates/`
- **Theme Settings:** Update `src/main/webapp/WEB-INF/liferay-look-and-feel.xml`

## Development Tips

- Use `mvn clean package` to build the theme
- The theme supports hot deployment for faster development
- Check Liferay logs for any deployment issues
- Theme changes may require cache clearing in Liferay

## Requirements

- Java 8+
- Maven 3.6+
- Liferay Portal 7.3.5
- IntelliJ IDEA (recommended)

## Theme Configuration

The theme includes:
- Site name display toggle
- Widget page content wrapping
- Barebone and Borderless portlet decorators
- Responsive navigation
- Modern color scheme

Happy theming! 🎨
