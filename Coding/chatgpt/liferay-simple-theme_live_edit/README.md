# Liferay Simple Theme (Live Editing)

## Setup Instructions

1. Build and deploy once:
   ```bash
   mvn clean package
   cp target/liferay-simple-theme.war <LIFERAY_HOME>/deploy/
   ```

2. After Liferay unpacks, the theme will be located at:
   ```
   <LIFERAY_HOME>/osgi/war/liferay-simple-theme-1.0.0/
   ```

3. In IntelliJ:
   - Go to **File > New > Module from Existing Sources**
   - Select the folder:
     ```
     <LIFERAY_HOME>/osgi/war/liferay-simple-theme-1.0.0/
     ```
   - Import as a simple module (no build system needed).

4. Now you can directly edit:
   - `META-INF/resources/templates/*.ftl`
   - `META-INF/resources/css/*.css`

5. Refresh browser to see changes instantly.

⚡ No need to rebuild the WAR for `.ftl` or `.css` changes.
